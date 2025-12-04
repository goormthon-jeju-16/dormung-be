import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length, Matches } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNumber()
  @Type(() => Number)
  meetingId: number;
}
