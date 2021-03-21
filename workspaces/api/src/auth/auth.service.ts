import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthCredentialsDTO, UserRO } from './auth-credentials.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(data: AuthCredentialsDTO): Promise<void> {
    return await this.userRepository.register(data);
  }

  async login(
    data: Partial<AuthCredentialsDTO>,
  ): Promise<{ token: string; user: UserRO }> {
    const user = await this.userRepository.login(data);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: user.username,
      email: user.email,
    };
    const token = await this.jwtService.sign(payload);

    return { token, user: user.toResponseObject() };
  }
}
