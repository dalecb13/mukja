import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';

// Legacy JwtPayload interface for backward compatibility with auth.service
export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface SupabaseJwtPayload {
  sub: string; // User ID (UUID)
  email: string;
  aud: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private supabaseAdmin: any;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    
    // For JWT validation, we need the JWT secret (not the anon key)
    // Supabase uses the same secret for signing all tokens
    const supabaseJwtSecret = configService.get<string>('SUPABASE_JWT_SECRET');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Use Supabase JWT secret for validation
      secretOrKey: supabaseJwtSecret || configService.get<string>('JWT_SECRET') || 'fallback-secret-change-me',
    });

    // Initialize Supabase admin client for user operations
    if (supabaseUrl && supabaseServiceKey) {
      this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
  }

  async validate(payload: SupabaseJwtPayload) {
    // Supabase JWT payload structure:
    // - sub: user UUID
    // - email: user email
    // - aud: audience (usually "authenticated")
    // - role: user role (usually "authenticated")

    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Find or create user in local database
    // Use Supabase user ID as the primary identifier
    let user = await this.prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // If user doesn't exist, create them
    // Note: We're using Supabase UUID as the ID, but Prisma uses cuid()
    // We'll store Supabase ID in a separate field or use email as the link
    if (!user) {
      // Try to get user metadata from Supabase
      let userName: string | undefined;
      if (this.supabaseAdmin) {
        try {
          const { data: supabaseUser } = await this.supabaseAdmin.auth.admin.getUserById(payload.sub);
          userName = supabaseUser?.user?.user_metadata?.name || 
                     supabaseUser?.user?.user_metadata?.full_name ||
                     supabaseUser?.user?.user_metadata?.display_name;
        } catch (error) {
          console.warn('Could not fetch user from Supabase:', error);
        }
      }

      // Create user in local database
      // Note: passwordHash is required in schema, but we'll set a dummy value
      // since Supabase handles authentication
      user = await this.prisma.user.create({
        data: {
          email: payload.email,
          passwordHash: 'supabase-auth', // Placeholder since Supabase handles auth
          name: userName,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
    } else {
      // Update user name if it's missing and we can get it from Supabase
      if (!user.name && this.supabaseAdmin) {
        try {
          const { data: supabaseUser } = await this.supabaseAdmin.auth.admin.getUserById(payload.sub);
          const userName = supabaseUser?.user?.user_metadata?.name || 
                          supabaseUser?.user?.user_metadata?.full_name ||
                          supabaseUser?.user?.user_metadata?.display_name;
          if (userName) {
            user = await this.prisma.user.update({
              where: { id: user.id },
              data: { name: userName },
              select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
              },
            });
          }
        } catch (error) {
          console.warn('Could not update user from Supabase:', error);
        }
      }
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
