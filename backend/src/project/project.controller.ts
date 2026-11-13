import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Response } from 'express';
import { UserGuard } from 'src/user/user.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get("show/:project_id")
  @UseGuards(UserGuard)
  async showById(
    @Param("project_id") project_id: number,
    @Res() response: Response,
    @Query("status") status: number,
    @Query("user_ids") ids: string
  ){
    return response.json(await this.projectService.showById({project_id, status, user_ids: ids ? ids.split(',').map(String) : []}))
  }

  @Get("show/:project_id/tasks")
  @UseGuards(UserGuard)
  async showByIdTasks(
    @Param("project_id") project_id: number,
    @Res() response: Response,
    @Query("status") status: number,
    @Query("user_ids") ids: string
  ){
    return response.json(await this.projectService.showByIdTasks({project_id, status, user_ids: ids ? ids.split(',').map(String) : []}))
  }

  @Get("backlog/:project_id")
  @UseGuards(UserGuard)
  async backlog(
    @Param("project_id") project_id: number,
    @Res() response: Response,
    @Query("status") status: number,
    @Query("user_ids") ids: string
  ){
    return response.json(await this.projectService.showById({project_id, status, user_ids: ids ? ids.split(',').map(String) : [], backlog: true}))
  }

  @Post('init')
  async init(
    @Body() data: {
      groupId: number,
      id: number,
      name: string
    },
    @Res() response: Response 
  ){
    return response.json(await this.projectService.init(data));
  }

  @Get(":group_id")
  @UseGuards(UserGuard)
  async main(
    @Param("group_id") group_id: number,
    @Res() response: Response
  ){
    return response.json(await this.projectService.main(group_id))
  }

  @Delete(":id")
  @UseGuards(UserGuard)
  async deleteFunc(
    @Param("id") id: number,
    @Res() response: Response,
  ){
    return response.json(await this.projectService.deleteFunc(id))
  }

  @Put(":id/notification")
  @UseGuards(UserGuard)
  async notification(
    @Param("id") id: number,
    @Res() response: Response,
    @Body("type") type: string,
    @Body("value") value: boolean
  ){
    return response.json(await this.projectService.notification(id, type, value))
  }

  @Put(":id/notification_all")
  @UseGuards(UserGuard)
  async notificationAll(
    @Param("id") id: number,
    @Res() response: Response,
    @Body("value") value: boolean,
  ){
    return response.json(await this.projectService.notification_all(id, value))
  }

  @Put(":id/notification_status_all")
  @UseGuards(UserGuard)
  async notificationStatusAll(
    @Param("id") id: number,
    @Res() response: Response,
    @Body("value") value: boolean,
  ){
    return response.json(await this.projectService.notification_status_all(id, value))
  }


  @Get(":id/archive")
  @UseGuards(UserGuard)
  async archives(
    @Param("id") id: number,
    @Res() response: Response,
  ){
    return response.json(await this.projectService.archives(id))
  }


  @Post(":id/add-role")
  @UseGuards(UserGuard)
  async addRole(
    @Param("id") id: number,
    @Res() response: Response,
    @Body("name") name: string,
  ){
    return response.json(await this.projectService.addRole(Number(id), name))
  }



  @Post(":id/remove-role")
  @UseGuards(UserGuard)
  async removeRole(
    @Param("id") id: number,
    @Res() response: Response,
    @Body("name") name: string,
  ){
    return response.json(await this.projectService.removeRole(Number(id), name))
  }


  @Post(":id/connect-role")
  @UseGuards(UserGuard)
  async connectRole(
    @Param("id") id: number,
    @Res() response: Response,
    @Body("role_id") role_id: string,
    @Body("user_id") user_id: string
  ){
    return response.json(await this.projectService.connectRole(Number(id), Number(user_id), Number(role_id)))
  }
}
