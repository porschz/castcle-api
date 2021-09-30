/*
 * Copyright (c) 2021, Castcle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 3 only, as
 * published by the Free Software Foundation.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License
 * version 3 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 3 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Castcle, 22 Phet Kasem 47/2 Alley, Bang Khae, Bangkok,
 * Thailand 10160, or visit www.castcle.com if you need additional information
 * or have any questions.
 */
import { FeatureService } from '@castcle-api/database';
import {
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  Req,
  UseInterceptors
} from '@nestjs/common';
import { CastLogger, CastLoggerOptions } from '@castcle-api/logger';
import {
  FeedsResponse,
  LanguageResponse,
  FeatureResponse
} from '@castcle-api/database/dtos';
import { ApiBearerAuth, ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import { CacheKeyName } from '@castcle-api/utils/cache';
import {
  CredentialInterceptor,
  CredentialRequest,
  HttpCacheSharedInterceptor
} from '@castcle-api/utils/interceptors';
import { Configs } from '@castcle-api/environments';

@ApiHeader({
  name: Configs.RequiredHeaders.AcceptLanguague.name,
  description: Configs.RequiredHeaders.AcceptLanguague.description,
  example: Configs.RequiredHeaders.AcceptLanguague.example,
  required: true
})
@ApiHeader({
  name: Configs.RequiredHeaders.AcceptVersion.name,
  description: Configs.RequiredHeaders.AcceptVersion.description,
  example: Configs.RequiredHeaders.AcceptVersion.example,
  required: true
})
@Controller({
  version: '1.0'
})
@Controller()
export class FeaturesController {
  constructor(private featureService: FeatureService) {}
  private readonly logger = new CastLogger(
    FeaturesController.name,
    CastLoggerOptions
  );

  @ApiBearerAuth()
  @ApiOkResponse({
    type: LanguageResponse
  })
  @UseInterceptors(HttpCacheSharedInterceptor)
  @CacheKey(CacheKeyName.HashtagsGet.Name)
  @CacheTTL(CacheKeyName.HashtagsGet.Ttl)
  @UseInterceptors(CredentialInterceptor)
  @Get('features')
  async getFeatures(@Req() req: CredentialRequest): Promise<FeatureResponse> {
    this.logger.log('Start get all features');
    const result = await this.featureService.getAll();
    this.logger.log('Success get all features');
    return {
      message: 'success',
      payload: result.map((feature) => feature.toFeaturePayload())
    };
  }
}
