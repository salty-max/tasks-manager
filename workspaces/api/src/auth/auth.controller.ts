import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDTO, UserRO } from './auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body(ValidationPipe) data: AuthCredentialsDTO): Promise<void> {
    return this.authService.register(data);
  }

  @Post('/login')
  login(
    @Body(ValidationPipe) data: Partial<AuthCredentialsDTO>,
  ): Promise<{ token: string; user: UserRO }> {
    return this.authService.login(data);
  }
}
