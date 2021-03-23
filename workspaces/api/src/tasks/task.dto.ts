import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

import { TaskStatus } from '../enums/task-status.enum';

export class TaskDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

export class TaskFilterDTO {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
