import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from 'src/prisma.service';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  controllers: [TaskController],
  providers: [
    TaskService, 
    PrismaService, 
    NotificationService,
    UserService
  ],
})
export class TaskModule {}
