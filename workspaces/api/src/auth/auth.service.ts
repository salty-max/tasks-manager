import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthCredentialsDTO, JwtPayload } from './auth-credentials.dto';
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

  async login(data: Partial<AuthCredentialsDTO>): Promise<{ token: string }> {
    const user = await this.userRepository.login(data);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      id: user.id,
    };

    const token = await this.jwtService.sign(payload);

    return { token };
  }
}
