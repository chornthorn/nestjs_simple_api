import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TransformInterceptor } from '@app/common/interceptors/transform.interceptor';
import { CurrentUserId } from '@app/common/decorators/current-user-id.decorator';

@UseInterceptors(TransformInterceptor)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUserId() userId: number) {
    createTaskDto.user_id = userId;
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll(@CurrentUserId() userId: number) {
    return this.taskService.findAll(userId);
  }


  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUserId() userId: number) {
    return this.taskService.findOne(+id, userId);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUserId() userId: number) {
    return this.taskService.remove(+id, userId);
  }
}
