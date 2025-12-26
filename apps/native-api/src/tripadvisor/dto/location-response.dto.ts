import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressDto {
  @ApiPropertyOptional()
  street1?: string;

  @ApiPropertyOptional()
  street2?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  postalcode?: string;

  @ApiPropertyOptional()
  address_string?: string;
}

export class LocationSearchResultDto {
  @ApiProperty()
  location_id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  distance?: string;

  @ApiPropertyOptional()
  rating?: string;

  @ApiPropertyOptional()
  bearing?: string;

  @ApiPropertyOptional({ type: AddressDto })
  address_obj?: AddressDto;
}

export class LocationSearchResponseDto {
  @ApiProperty({ type: [LocationSearchResultDto] })
  data: LocationSearchResultDto[];
}

export class LocationDetailsDto {
  @ApiProperty()
  location_id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  web_url?: string;

  @ApiPropertyOptional({ type: AddressDto })
  address_obj?: AddressDto;

  @ApiPropertyOptional()
  latitude?: string;

  @ApiPropertyOptional()
  longitude?: string;

  @ApiPropertyOptional()
  timezone?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional()
  rating?: string;

  @ApiPropertyOptional()
  rating_image_url?: string;

  @ApiPropertyOptional()
  num_reviews?: string;

  @ApiPropertyOptional()
  price_level?: string;

  @ApiPropertyOptional({ type: [String] })
  cuisine?: { name: string; localized_name: string }[];

  @ApiPropertyOptional()
  hours?: object;
}

export class PhotoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  is_blessed: boolean;

  @ApiPropertyOptional()
  caption?: string;

  @ApiPropertyOptional()
  published_date?: string;

  @ApiProperty()
  images: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
    original?: { url: string; width: number; height: number };
  };
}

export class LocationPhotosResponseDto {
  @ApiProperty({ type: [PhotoDto] })
  data: PhotoDto[];
}






