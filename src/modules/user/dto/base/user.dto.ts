import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  residenceArea: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 8)
  @Matches(/^[가-힣a-zA-Z]+$/)
  nickname: string;

  @IsNotEmpty()
  @IsString()
  residencePeriod: string;

  @IsNotEmpty()
  @IsString()
  introduceSelf: string;

  @IsNotEmpty()
  @IsString()
  profileImagePath?: string;
}
