import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

import { TaskStatus } from '../enums/task-status.enum';

import { TaskDTO, TaskFilterDTO } from './task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDTO: TaskFilterDTO, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDTO, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, ownerId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return found;
  }

  async createTask(taskDTO: TaskDTO, user: User): Promise<Task> {
    const task = await this.taskRepository.create({
      ...taskDTO,
      status: TaskStatus.OPEN,
      owner: user,
    });

    try {
      await this.taskRepository.save(task);
    } catch (err) {
      this.logger.error(
        `Failed to create a task for user ${user.username}. Data: ${taskDTO}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }

    delete task.owner;
    return task;
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;

    await task.save();

    return task;
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const res = await this.taskRepository.delete({ id, ownerId: user.id });

    if (!res.affected) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
}
