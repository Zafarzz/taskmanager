import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { Response } from 'express';
import { UserGuard } from 'src/user/user.guard';
import { CreateTaskDto } from './task.dto';
import { CatchErrorDecorator } from 'src/decorators/catch.error.decorator';


@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get("notification_task_priotity")
  @UseGuards(UserGuard)
  async notification_task_priotity()
  {
    return await this.taskService.notification_task_priotity();
  }

  @Get("send_weekly_status")
  @UseGuards(UserGuard)
  async send_weekly_status()
  {
    return await this.taskService.send_weekly_status();
  }


  @Get("send_weekly_status_maual/:project_id")
  @UseGuards(UserGuard)
  async send_weekly_status_maual(
    @Param("project_id") project_id: string
  ){
    return await this.taskService.send_weekly_status_maual(+project_id);
  }

  @Post('create')
  @UseGuards(UserGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() data: CreateTaskDto,
    @Res() response: Response,
    @Req() req,
  ){
    const {user} = req;
    try {
      return response.json(await this.taskService.create(data, user.telegram_id));
    } catch (error) {
      throw new BadRequestException('Error creating task: ' + error.message);
    }
  }

  @Post('init')
  async init(
    @Body() data: {
      topic_id: string,
      group_id: string,
      user_id: string, 
      topic_title: string, 
      message_id: number, 
      name: string,
      participant: string[],
      is_backlog: boolean
    },
    @Res() response: Response
  ){
    return response.json(await this.taskService.init(data));
  }

  @Get("show/:id")
  @UseGuards(UserGuard)
  async show(
    @Req() req,
    @Res() response: Response,
    @Param("id") id: number,
  ){
    const {user} = req;
    return response.json(await this.taskService.show(id, user.telegram_id))
  }

  @Get(":id/:status")
  @UseGuards(UserGuard)
  async tasks(
    @Req() req,
    @Res() response: Response,
    @Param("id") id: number,
    @Param("status") status: number,
  ){
    const {user} = req;
    return response.json(await this.taskService.tasks(user.telegram_id, status, id))
  }

  @Put(":id/status")
  @UseGuards(UserGuard)
  async updateStatus(
    @Req() req,
    @Res() response: Response,
    @Param("id") id: number,
    @Body("status") status: number,    
  ){
    const {user} = req;
    return response.json(await this.taskService.updateStatus(user.telegram_id, status, id))
  }


  @Put(":id/priority")
  @UseGuards(UserGuard)
  async updatePriority(
    @Req() req,
    @Res() response: Response,
    @Param("id") id: number,
    @Body("priority") priority: number,    
  ){
    const {user} = req;
    return response.json(await this.taskService.updatePriority(user.telegram_id, priority, id))
  }


  @Delete(":id")
  @UseGuards(UserGuard)
  async deleteUser(
    @Req() req,
    @Res() response: Response,
    @Param("id") id: number,
  ){
    const {user} = req;
    return response.json(await this.taskService.delete(user.telegram_id, id))
  }

  @Put(":id/archive")
  @UseGuards(UserGuard)
  async archive(
    @Req() req,
    @Res() response: Response,
    @Param("id") id: number,
    @Body("archive") archive: any, 
  ){
    const {user} = req;
    return response.json(await this.taskService.archive(user.telegram_id, id, archive))
  }

  @Put(":id/comment")
  @UseGuards(UserGuard)
  async comment(
    @Req() req,
    @Param("id") id: number,
    @Res() response: Response,
    @Body("text") text: string, 
  ){
    const {user} = req;
    return response.json(await this.taskService.comment(user.telegram_id, id, text))
  }

  @Put(':id/participant')
  @UseGuards(UserGuard)
  async participant(
    @Req() req,
    @Param("id") id: number,
    @Res() response: Response,
    @Body("participant") participant: number[],
  ){
    const {user} = req;
    return response.json(await this.taskService.participant(id, participant, user.telegram_id));
  }

  @Put(":id/update")
  @UseGuards(UserGuard)
  @CatchErrorDecorator()
  async update(
    @Req() req,
    @Param("id") id: number,
    @Res() response: Response,
    @Body("name") name: string,
    @Body("description") description: string,
  )
  {
    const {user} = req;
    return response.json(await this.taskService.update({id, name, description, telegram_id: user.telegram_id}));
  }


}
