import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length, Matches } from 'class-validator';

export class CreateBoardReplyDto {
  @IsNotEmpty()
  @IsString()
  reply: string;

  @IsNumber()
  @Type(() => Number)
  boardId: number;
}
