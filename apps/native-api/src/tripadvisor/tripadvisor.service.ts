import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import {
  LocationSearchResponseDto,
  LocationDetailsDto,
  LocationPhotosResponseDto,
} from './dto/location-response.dto';
import { LocationCategory } from './dto/location-search.dto';

@Injectable()
export class TripadvisorService {
  private readonly baseUrl = 'https://api.content.tripadvisor.com/api/v1';
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('TRIPADVISOR_API_KEY');
    if (!this.apiKey) {
      console.warn('TRIPADVISOR_API_KEY is not set in environment variables');
    }
  }

  async searchLocations(
    searchQuery: string,
    category?: LocationCategory,
    latLong?: string,
    language: string = 'en',
  ): Promise<LocationSearchResponseDto> {
    try {
      const params: Record<string, string> = {
        key: this.apiKey,
        searchQuery,
        language,
      };

      if (category) {
        params.category = category;
      }

      if (latLong) {
        params.latLong = latLong;
      }

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/location/search`, { params }),
      );

      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to search locations');
    }
  }

  async getLocationDetails(
    locationId: string,
    language: string = 'en',
  ): Promise<LocationDetailsDto> {
    try {
      const params = {
        key: this.apiKey,
        language,
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/location/${locationId}/details`, {
          params,
        }),
      );

      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get location details');
    }
  }

  async getLocationPhotos(
    locationId: string,
    language: string = 'en',
    limit: number = 10,
    offset: number = 0,
  ): Promise<LocationPhotosResponseDto> {
    try {
      const params = {
        key: this.apiKey,
        language,
        limit: limit.toString(),
        offset: offset.toString(),
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/location/${locationId}/photos`, {
          params,
        }),
      );

      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get location photos');
    }
  }

  private handleError(error: unknown, message: string): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const errorMessage =
        error.response?.data?.message || error.message || message;

      throw new HttpException(
        {
          statusCode: status,
          message: errorMessage,
          error: 'TripAdvisor API Error',
        },
        status,
      );
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message,
        error: 'Internal Server Error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

