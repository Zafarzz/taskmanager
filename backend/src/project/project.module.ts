import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from 'src/prisma.service';
import { StatusService } from 'src/status/status.service';

@Module({
  controllers: [ProjectController],
  providers: [
    ProjectService, 
    PrismaService, 
    StatusService,
  ],
})
export class ProjectModule {}
