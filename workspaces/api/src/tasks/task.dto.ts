import { TaskStatus } from '@tasks-manager/common';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

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
