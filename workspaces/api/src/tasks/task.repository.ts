import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { TaskFilterDTO } from './task.dto';

import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
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

    const tasks = await query.getMany();

    return tasks;
  }
}
