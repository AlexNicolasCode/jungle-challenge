import {
    Injectable,
    InternalServerErrorException,
    Logger,
    UnprocessableEntityException,
} from '@nestjs/common';

import { RefreshTokenInputDto, RefreshTokenOutputDto } from '../dtos';
import {
    CheckUserExistsByEmailService,
    DecodeTokenService,
    GenerateTokenService,
} from '../services';

@Injectable()
export class RefreshTokenUseCase {
  private readonly logger = new Logger(RefreshTokenUseCase.name);

  constructor(
    private readonly decodeTokenService: DecodeTokenService,
    private readonly checkUserExistsByEmailService: CheckUserExistsByEmailService,
    private readonly generateTokenService: GenerateTokenService,
  ) {}

  async execute(dto: RefreshTokenInputDto): Promise<RefreshTokenOutputDto> {
    const decodedToken = this.decodeTokenService.decodeToken({
      token: dto.refreshToken,
      type: 'refresh',
    });
    if (!decodedToken || !decodedToken?.email || !decodedToken?.name) {
      throw new UnprocessableEntityException(
        'Invalid or expired token. Please, generate a new token.',
      );
    }
    const hasUser =
      await this.checkUserExistsByEmailService.checkUserExistsByEmail(
        decodedToken.email,
      );
    if (!hasUser) {
      this.logger.error(`Invalid Refresh Token received`);
      throw new InternalServerErrorException();
    }
    const token = this.generateTokenService.generateAccessToken({
      name: decodedToken.name,
      email: decodedToken.email,
    });
    return {
      accessToken: token.token,
      expiresIn: token.expiresIn,
      expireAt: token.expireAt,
    };
  }
}
