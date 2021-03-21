import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthCredentialsDTO } from './auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async register(data: AuthCredentialsDTO): Promise<void> {
    const salt = await bcrypt.genSalt();

    const user = await this.create({
      ...data,
      password: await this.hashPassword(data.password, salt),
      salt,
    });

    try {
      await this.save(user);
    } catch (err) {
      console.log(err);
      if (err.code === '23505') {
        // duplicate key
        throw new ConflictException('Username or email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
