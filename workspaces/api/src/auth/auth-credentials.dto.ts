import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).*$/, {
    message:
      'Password must contain at least one capital letter and one lowercase letter, a number and a special character',
  })
  password: string;
}

export interface JwtPayload {
  id: number;
}

export interface UserRO {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  token?: string;
}
