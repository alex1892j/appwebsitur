import { Type } from 'class-transformer';
import { IsString, IsEmail, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;

  @Type(() => Number)   // 🔑 MUY IMPORTANTE
  @IsInt()
  @Min(1)
  age: number;
}

