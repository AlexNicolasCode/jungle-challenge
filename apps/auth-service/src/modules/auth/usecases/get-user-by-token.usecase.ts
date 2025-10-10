import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { GetUserByTokenInputDto, GetUserByTokenOutputDto } from '../dtos';
import { DecodeTokenService, LoadUserByEmailService } from '../services';

@Injectable()
export class GetUserByTokenUseCase {
  private readonly logger = new Logger(GetUserByTokenUseCase.name);

  constructor(
    private readonly loadUserByEmailService: LoadUserByEmailService,
    private readonly decodeTokenService: DecodeTokenService,
  ) {}

  async execute(dto: GetUserByTokenInputDto): Promise<GetUserByTokenOutputDto> {
    try {
      const decodedToken = this.decodeTokenService.decodeToken({
        token: dto.accessToken,
        type: 'access',
      });
      if (!decodedToken.email) {
        return null;
      }
      const user = await this.loadUserByEmailService.loadUserByEmail(
        decodedToken.email,
      );
      if (!user) {
        return null;
      }
      return {
        id: user.id,
        name: user.name,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
