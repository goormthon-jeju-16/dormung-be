import { IsArray, IsNotEmpty, IsString, Length, Matches, ValidateNested } from 'class-validator';
import { UserDto } from './base/user.dto';
import { Type } from 'class-transformer';

export class CreateUserDto extends UserDto {
  @IsNotEmpty()
  @IsArray()
  @Type(() => Number)
  userPreferredCategoryIds?: number[];
}
