import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { GenerateTokenService } from '../tokens';
import { CreateAuthTokensOutputDto } from '../../dtos/outputs';
import { CreateAuthTokensInputDto } from '../../dtos/inputs';

@Injectable()
export class GenerateAuthTokensService {
  private readonly logger = new Logger(GenerateAuthTokensService.name);

  constructor(private readonly generateTokenService: GenerateTokenService) {}

  generateAuthTokens({
    name,
    email,
  }: CreateAuthTokensInputDto): CreateAuthTokensOutputDto {
    try {
      const { accessToken } = this.generateTokenService.generateAccessToken({
        name,
        email,
      });
      const { refreshToken, expireAt, expiresIn } =
        this.generateTokenService.generateRefreshToken({
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
