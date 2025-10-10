import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class LoggedUserInputDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
