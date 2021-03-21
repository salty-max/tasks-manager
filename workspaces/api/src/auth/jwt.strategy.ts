import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRO } from './auth-credentials.dto';
import { UserRepository } from './user.repository';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'ILoveBulbasaur',
    });
  }

  async validate(payload: UserRO): Promise<UserRO> {
    const { id } = payload;
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user.toResponseObject();
  }
}
