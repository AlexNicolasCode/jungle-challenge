import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentInputDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
