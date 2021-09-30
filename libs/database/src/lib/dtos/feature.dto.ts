import { ApiProperty } from '@nestjs/swagger';

export class FeaturePayloadDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  key: string;
}

export class FeatureResponse {
  @ApiProperty()
  message: string;
  @ApiProperty({ type: FeaturePayloadDto, isArray: true })
  payload: FeaturePayloadDto[];
}

export interface CreateFeature {
  slug: string;
  name: string;
}
