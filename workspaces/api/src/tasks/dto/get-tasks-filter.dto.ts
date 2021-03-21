import { TaskStatus } from '@tasks-manager/common';

export class GetTasksFilterDto {
  status?: TaskStatus;
  search?: string;
}
