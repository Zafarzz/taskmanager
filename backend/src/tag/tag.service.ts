import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TagService {
    constructor(
        private readonly prisma: PrismaService
    ){}

    async init(name: string)
    {
        try {
            const check = await this.prisma.tag.findFirst({
                where: {
                    name
                }
            });

            if(check) return check;

            return await this.prisma.tag.create({
                data: {
                    name
                }
            })
        } catch (error) {
            console.log("tag init error: " + error);
        }
    }

    async connectTask(task_id: number, tags: string[])
    {
        try {
            if(tags && tags.length)
            {
                const checkTags = await Promise.all(tags.map(tag => this.init(tag)));

                const taskTags = await this.prisma.taskTag.findMany({
                    where: { task_id }
                });

                const taskTagIds = taskTags.map(taskTag => taskTag.tag_id);

                if(taskTags.length)
                {
                    await this.prisma.taskTag.deleteMany({
                        where: {
                            task_id,
                            tag_id: {
                                in: taskTagIds
                            }
                        }
                    })
                }

                const newTagData = checkTags.map(newTag => ({
                    tag_id: newTag.id,
                    task_id,
                }));
                
                await this.prisma.taskTag.createMany({
                    data: newTagData
                });
            }
            return true;
        } catch (error) {
            console.log("connectTask tag error: " + error);
        }
    }
}
