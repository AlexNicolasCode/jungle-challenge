import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentInputDto {
  @IsUUID()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  authorName: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
