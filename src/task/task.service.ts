import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) { }

  async create(createTaskDto: CreateTaskDto) {
    const _entity = this.taskRepository.create({ ...createTaskDto });
    const result = await this.taskRepository.save(_entity);
    if (!result) {
      throw new BadRequestException('Task not created');
    }
    return result;
  }

  async findAll(user_id: number) {
    const tasks = await this.taskRepository.find({ where: { user_id } });
    return tasks;
  }

  async findOne(id: number, user_id: number) {
    const task = await this.taskRepository.findOneBy({ id, user_id });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOneBy({ id, user_id: updateTaskDto.user_id });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const _entity = this.taskRepository.create({ ...updateTaskDto });
    const result = await this.taskRepository.save({ ...task, ..._entity });
    if (!result) {
      throw new BadRequestException('Task not updated');
    }
    return result;
  }

  async remove(id: number, user_id: number) {
    const task = await this.taskRepository.findOneBy({ id, user_id });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const result = await this.taskRepository.remove(task);
    if (!result) {
      throw new BadRequestException('Task not removed');
    }
    return 'Task removed';
  }
}
