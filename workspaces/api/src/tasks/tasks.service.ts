import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from '@tasks-manager/common';
import { User } from 'src/auth/user.entity';

import { TaskDTO, TaskFilterDTO } from './task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
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

    await this.taskRepository.save(task);

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
