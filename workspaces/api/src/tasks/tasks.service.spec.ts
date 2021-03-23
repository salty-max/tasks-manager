import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { TaskStatus } from '../enums/task-status.enum';

import { TaskDTO, TaskFilterDTO } from './task.dto';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockUser = {
  id: 1,
  username: 'Test user',
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      (taskRepository.getTasks as jest.Mock).mockResolvedValue('some value');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: TaskFilterDTO = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };
      const result = await tasksService.getTasks(filters, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('some value');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
      const mockTask = { title: 'Test task', description: 'Test desc' };
      (taskRepository.findOne as jest.Mock).mockResolvedValue(mockTask);
      expect(taskRepository.findOne).not.toHaveBeenCalled();

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, ownerId: mockUser.id },
      });
    });

    it('throws an error as task is not found', () => {
      (taskRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls taskRepository.create() and returns the result', async () => {
      (taskRepository.create as jest.Mock).mockResolvedValue('some task');
      (taskRepository.save as jest.Mock).mockResolvedValue('some response');
      expect(taskRepository.create).not.toHaveBeenCalled();
      const body: TaskDTO = { title: 'Test task', description: 'Test desc' };
      const mockTask = {
        title: 'Test task',
        description: 'Test desc',
        owner: mockUser,
        status: 'OPEN',
      };

      const result = await tasksService.createTask(body, mockUser);
      expect(taskRepository.create).toHaveBeenCalledWith(mockTask);
      expect(result).toEqual('some task');
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.delete() to delete a task', async () => {
      (taskRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        ownerId: mockUser.id,
      });
    });

    it('throws an error as task could not be found', () => {
      (taskRepository.delete as jest.Mock).mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('updates task status', async () => {
      const save = jest.fn().mockResolvedValue(true);

      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });

      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.DONE,
        mockUser,
      );
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
