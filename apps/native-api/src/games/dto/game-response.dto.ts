import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GameOwnerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  name: string | null;
}

export class GameGroupDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class SearchResultDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tripadvisorId: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  address: string | null;

  @ApiPropertyOptional()
  latitude: number | null;

  @ApiPropertyOptional()
  longitude: number | null;

  @ApiPropertyOptional()
  rating: number | null;

  @ApiPropertyOptional()
  priceLevel: string | null;

  @ApiPropertyOptional()
  imageUrl: string | null;
}

export class GameSearchDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  query: string;

  @ApiPropertyOptional()
  category: string | null;

  @ApiPropertyOptional()
  latLong: string | null;

  @ApiProperty({ type: GameOwnerDto })
  user: GameOwnerDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [SearchResultDto] })
  results: SearchResultDto[];
}

export class GameDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'] })
  status: string;

  @ApiProperty({ type: GameOwnerDto })
  owner: GameOwnerDto;

  @ApiPropertyOptional({ type: GameGroupDto })
  group: GameGroupDto | null;

  @ApiProperty()
  searchCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GameDetailDto extends GameDto {
  @ApiProperty({ type: [GameSearchDto] })
  searches: GameSearchDto[];
}

