import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { GenerateTokenService } from '..';
import { GenerateAuthTokensInputDto } from './generate-auth-tokens.input.dto';
import { GenerateAuthTokensOutputDto } from './generate-auth-tokens.output.dto';

@Injectable()
export class GenerateAuthTokensService {
  private readonly logger = new Logger(GenerateAuthTokensService.name);

  constructor(private readonly generateTokenService: GenerateTokenService) {}

  generateAuthTokens(dto: GenerateAuthTokensInputDto): GenerateAuthTokensOutputDto {
    try {
      const { token: accessToken } =
        this.generateTokenService.generateAccessToken(dto);
      const {
        token: refreshToken,
        expireAt,
        expiresIn,
      } = this.generateTokenService.generateRefreshToken(dto);
      return {
        accessToken,
        refreshToken,
        expiresIn,
        expireAt,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
