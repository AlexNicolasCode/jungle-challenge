import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { GenerateTokenService } from '..';
import { GenerateAuthTokensOutputDto } from './generate-auth-tokens.output.dto';
import { GenerateAuthTokensInputDto } from './generate-auth-tokens.input.dto';

@Injectable()
export class GenerateAuthTokensService {
  private readonly logger = new Logger(GenerateAuthTokensService.name);

  constructor(private readonly generateTokenService: GenerateTokenService) {}

  generateAuthTokens({
    name,
    email,
  }: GenerateAuthTokensInputDto): GenerateAuthTokensOutputDto {
    try {
      const { token: accessToken } =
        this.generateTokenService.generateAccessToken({
          name,
          email,
        });
      const {
        token: refreshToken,
        expireAt,
        expiresIn,
      } = this.generateTokenService.generateRefreshToken({
        name,
        email,
      });
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
