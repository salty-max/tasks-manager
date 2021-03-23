import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { TaskFilterDTO } from './task.dto';

import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(filterDTO: TaskFilterDTO, user: User): Promise<Task[]> {
    const { status, search } = filterDTO;
    const query = this.createQueryBuilder('task');

    query.where('task.ownerId = :id', { id: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        `(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)`,
        {
          search: `%${search}%`,
        },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(
        `Failed to get tasks for user ${
          user.username
        }, Filters: ${JSON.stringify(filterDTO)}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
