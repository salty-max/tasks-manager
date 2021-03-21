import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Task, TaskStatus } from '@tasks-manager/common';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new HttpException('No task found', HttpStatus.NOT_FOUND);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);

    task.status = status;

    return task;
  }

  deleteTask(id: string): Task {
    const taskToDelete = this.tasks.find((task) => task.id == id);

    if (!taskToDelete) {
      throw new HttpException('No task found', HttpStatus.NOT_FOUND);
    }

    this.tasks = this.tasks.filter((task) => task.id !== taskToDelete.id);
    return taskToDelete;
  }
}
