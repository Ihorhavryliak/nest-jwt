import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  id: number;
  @IsEmail()
  email: string;
  firstName: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  roles: string[];
  information: string[];
  city: string;
}
