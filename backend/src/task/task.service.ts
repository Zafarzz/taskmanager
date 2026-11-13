import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma.service';
import { defaultStatuses } from 'src/status/status.default';
import { UserService } from 'src/user/user.service';

interface NewTask {
    status_id: number,
    project_id: number,
    user_id: string,
    name: string,
    participants: string,
    description: string,
    priority: number,
    point: number,
    message_id: number,
    deadline?: string,
    is_backlog?: boolean
}

@Injectable()
export class TaskService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notification: NotificationService,
        private readonly userService: UserService
    ){}

    async create(
        params: {
            project_id: number,
            name: string,
            description: string,
            participant: string[],
            priority: number,
            point: number,
            message_id?: number,
            deadline?: string,
            is_backlog?: boolean
        }, user_id: string
    ){
        const {
            project_id,
            name,
            description,
            participant,
            priority,
            point,
            message_id,
            deadline,
            is_backlog
        } = params;

        const check = await this.prisma.task.findFirst({
            where: {
                project_id,
                user_id,
                name,
            },
            include: {
                status: true,
                user: true,
                project: { include: { group: true } }
            }
        });

        if(check) return check;

        let statuses: any = await this.prisma.status.findMany({
            where: { project_id }
        });

        if(statuses.length === 0)
        {
            statuses = await this.prisma.status.createMany({
                data: this.statusList.map((element) => ({
                    name: element.name,
                    order: element.id,
                    project_id
                }))
            });
        }

        const status = await this.prisma.status.findFirst({
            where: { project_id },
            orderBy: { order: "asc" }
        });

        const data: NewTask = {
            status_id: status.id,
            project_id,
            user_id,
            name,
            participants: user_id,
            description,
            priority,
            point,
            message_id,
        }

        if(this.isISODateString(deadline)) data.deadline = new Date(deadline).toISOString();
        if(is_backlog) data.is_backlog = true;

        const newTask = await this.prisma.task.create({
            data,
            include: {
                status: true,
                user: true,
                project: { include: { group: true } }
            }
        });  

        const change = await this.prisma.taskChange.create({
            data: {
                user_id: String(user_id),
                task_id: Number(newTask.id),
                type: "created",
                old_value: "created",
                new_value: "created"
            }
        });

        // const participantCreateData = [];

        // if(participant.length)
        // {
        //     participant.map((part: string) => {
        //         if(!isNaN(Number(part))){
        //             participantCreateData.push({
        //                 user_id: part,
        //                 task_id: newTask.id
        //             })
        //         }
        //     })
        // }

        const participantCreateData = participant
            .filter((part: string) => !isNaN(Number(part)))
            .map((part: string) => ({
                user_id: part,
                task_id: newTask.id
            }));
            
        await this.prisma.taskUser.createMany({ data: participantCreateData });
        await this.notification.notificationSender(change.id);
        return newTask;
    }

    async init(props: {
        topic_id: string,
        group_id: string,
        user_id: string, 
        topic_title: string, 
        message_id: number, 
        name: string,
        participant: string[],
        is_backlog: boolean
    }){
        const { 
            topic_id,
            topic_title, 
            message_id, 
            user_id, 
            name,
            group_id,
            participant,
            is_backlog
        } = props;

        let title = name;
        let description = "";
        if(name.length > 50)
        {
            description = name;
            title = this.getFirstWords(name, 5)
        }

        const project = await this.prisma.project.findFirst({
            where: {
                topic_id: String(topic_id),
                name: topic_title,
                group_id: String(group_id)
            }
        });

        const participants = await this.prisma.user.findMany({
            where: {
                username: {in: participant}
            }
        });

        return await this.create({
            project_id: project.id,
            name: title,
            description,
            participant: participants.length > 0 ? participants.map(p => p.telegram_id) : [user_id],
            priority: 2,
            point: 0,
            message_id,
            is_backlog
        }, user_id)
    }

    private statusList = [
        {
            id: 1,
            name: "To do",
        },
        {
            id: 2,
            name: "In Progress",
        },
        {
            id: 3,
            name: "Testing",
        },
        {
            id: 4,
            name: "Completed",
        }
    ];

    async tasks(user_id: number, status_id: number, id: number)
    {
        try {
            return await this.prisma.task.findMany({
                where: {
                    project_id: Number(id),
                    status_id: Number(status_id),
                    is_archive: false,
                },
                include: {
                    user: true,
                    status: true,
                    project: true
                }
            });
        } catch (error) {
            console.log("Tasks error :" + error);
        }
    }

    async updateStatus(user_id: number, status_id: number, id: number)
    {
        const taskId = Number(id);
        let statusID = Number(status_id);
        try {
            const task = await this.prisma.task.findUnique({
                where: {
                    id: taskId
                },
                include: {
                    status: true,
                    project: true,
                }
            });
            if(!task) throw new NotFoundException("Task not found");

            let status: any;
            if(statusID === -1)
            {
                status = await this.prisma.status.findFirst({
                    where: {
                        name: "Completed",
                        project_id: Number(task.project_id)
                    }
                });
                if (status) statusID = status.id;
            }else{
                status = await this.prisma.status.findUnique({
                    where: { id: statusID },
                });
            }
        
            if(!status) throw new NotFoundException("Status not available");

            const data: any = {
                status_id: statusID,
                is_completed: ["Завершено", "Tugallangan", "Completed"].includes(status.name) || false,
            }

            if (task.is_completed && !data.is_completed) {
                data.is_completed = false;
            }
   
            await this.prisma.task.update({
                where: { id: taskId },
                data
            });

            const change = await this.prisma.taskChange.create({
                data: {
                    user_id: String(user_id),
                    task_id: taskId,
                    type: "status",
                    old_value: task.status.name,
                    new_value: status.name
                }
            });

            if(change) await this.notification.notificationSender(change.id);

            return {
                message: "Status successfully changed"
            }

        } catch (error) {
            console.log("Update status task: " + error);
            throw error; 
        }
    }

    async updatePriority(user_id: number, priority_id: number, id: number)
    {
        try {
            const task = await this.prisma.task.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    status: true,
                    project: true,
                }
            });
            if(!task) throw new NotFoundException("Task not found");

            if(Number(priority_id) !== task.priority)
            {
                await this.prisma.task.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        priority: Number(priority_id)
                    }
                });
            }

            const change = await this.prisma.taskChange.create({
                data: {
                    user_id: String(user_id),
                    task_id: Number(id),
                    type: "priority",
                    old_value: String(task.priority),
                    new_value: String(priority_id)
                }
            });

            if(change) await this.notification.notificationSender(change.id);
            return {
                message: "Status successfully changed"
            }

        } catch (error) {
            console.log("Update status task: " + error);
        }
    }

    async show(id: number, user_id: string)
    {
        try {
            const task: any = await this.prisma.task.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    status: true,
                    user: true,
                    project: true,
                    taskUser: {
                        include: {
                            user: true
                        }
                    },
                    taskChange: {
                        include: {
                            user: true,
                        },
                        orderBy: {
                            id: "desc"
                        }
                    },
                    taskComment: {
                        include: {
                            user: true
                        },
                        orderBy: {
                            id: "desc"
                        }
                    }
                }
            });

            if(!task) throw new NotFoundException("Task not found");

            if(!(await this.userService.isGroupUser(task.project.group_id, user_id))) throw new HttpException("Permission denied", 403);

            task.users = await this.prisma.user.findMany({
                where: {
                    groupUsers: {
                        some: {
                            group_id: task.project.group_id
                        }
                    }
                }
            });

            await this.viewed(user_id, task.id)

            return task;
        } catch (error) {
            console.log("Show task show id " + error);
        }
    }

    async participants(usernames: string[], task_id: number)
    {
        if(usernames.length > 0)
        {
            usernames.map(async (username) => {
                try {
                    const user = await this.prisma.user.findFirst({
                        where: {
                            username: username.replace(/^@/, '')
                        }
                    });
                    if(!user) return
                    const task = await this.prisma.task.findUnique({
                        where: {
                            id: Number(task_id)
                        }
                    });
                    if(!task) return

                    const check = await this.prisma.taskUser.findFirst({
                        where: {
                            user_id: user.telegram_id,
                            task_id: Number(task_id)
                        }
                    });

                    if(!check)
                    {
                        await this.prisma.taskUser.create({
                            data: {
                                user_id: user.telegram_id,
                                task_id: Number(task_id)
                            }
                        });
                    }

                } catch (error) {
                    console.log("taskUser error" + error);
                }
            });
        }
    }

    async delete(user_id: number, id: number)
    {
        const taskId = Number(id);
        const task = await this.prisma.task.findUnique({
            where: {
                id: taskId
            }
        });

        if(!task) throw new NotFoundException("Task not found");

        try {
            await this.prisma.$transaction([
                this.prisma.notification.deleteMany({
                    where: {
                        change: {
                            task_id: taskId
                        }
                    }
                }),
                this.prisma.taskComment.deleteMany({
                    where: {
                        task_id: taskId
                    }
                }),
                this.prisma.taskChange.deleteMany({
                    where: {
                        task_id: taskId
                    }
                }),
                this.prisma.taskUser.deleteMany({
                    where: {
                        task_id: taskId
                    }
                }),
                this.prisma.taskTag.deleteMany({
                    where: {
                        task_id: taskId
                    }
                }),
                this.prisma.task.delete({
                    where: {
                        id: taskId
                    }
                })
            ]);

            return "Deleted successfully";
        } catch (error) {
            console.log("Delete task error: " + error);
            return "Not deleted"
        }
    }

    async archive(user_id: number, id: number, archive: boolean)
    {
        try {
            const task = await this.prisma.task.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    project: true
                }
            });
            if(!task) throw new NotFoundException("Task not found");

            let new_value: string = "Task was archived";
            let type: string = "archive";

            if(archive)
            {
                await this.prisma.task.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        is_archive: true
                    }
                });
            }else{
                await this.prisma.task.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        is_archive: false
                    }
                });
                
                new_value = "Task was unarchived";
                type = "unarchive";
            }

            const change = await this.prisma.taskChange.create({
                data: {
                    user_id: String(user_id),
                    task_id: Number(id),
                    type,
                    old_value: "",
                    new_value,
                }
            });

            if(change) await this.notification.notificationSender(change.id);

            return "Successfully changed";
        } catch (error) {
            console.log("Archive error: " + error);
        }
    }

    async comment(user_id: number, id: number, text: string)
    {
        try {
            const task = await this.prisma.task.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    status: true,
                    project: true,
                }
            });
            if(!task) throw new NotFoundException("Task not found");

            if(text === "") throw new BadRequestException("Not found text");

            const comment = this.prisma.taskComment.create({
                data: {
                    comment: text,
                    task_id: Number(id),
                    user_id: String(user_id)
                }
            });

            if(comment)
            {
                const change = await this.prisma.taskChange.create({
                    data: {
                        user_id: String(user_id),
                        task_id: Number(id),
                        type: "comment",
                        old_value: "comment",
                        new_value: text
                    }
                });
    
                if(change) await this.notification.notificationSender(change.id);
                return comment
            }

            throw new NotFoundException("Task not found"); 
        } catch (error) {
            console.log("create commment error: " + error);
            throw new NotFoundException("Task not found"); 
        }
    }

    async participant(id: number, participant: number[], telegram_id: number)
    {
        const task = await this.prisma.task.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                taskUser: true
            }
        });

        if(!task) throw new NotFoundException("Task not found");

        try {
            if(participant.length > 0)
            {
                let old_value = "";
                let new_value = "";
                const oldUsers = await this.prisma.taskUser.findMany({
                    where: {
                        task_id: Number(id),
                    },
                    include: {
                        user: true
                    }
                });
                
                if(oldUsers.length){
                    oldUsers.map(oldUser => {
                        old_value += oldUser.user.name + ", "
                    });
                    await this.prisma.taskUser.deleteMany({
                        where: {
                            task_id: Number(id),
                        }
                    });
                }
          
                const checkCreate = await this.prisma.taskUser.createMany({
                    data: participant.map((participant_item) => ({
                        task_id: Number(id),
                        user_id: String(participant_item)
                    }))
                });

                if(checkCreate)
                {
                    const newUsers = await this.prisma.taskUser.findMany({
                        where: {
                            task_id: Number(id),
                        },
                        include: {
                            user: true
                        }
                    });
                    if(newUsers.length)
                    {
                        newUsers.map(newUser => {
                            new_value += newUser.user.name + ", "
                        });
                    }

                    const change = await this.prisma.taskChange.create({
                        data: {
                            task_id: Number(id),
                            user_id: String(telegram_id),
                            old_value,
                            new_value,
                            type: "participant"
                        }
                    });

                    if(change) await this.notification.notificationSender(change.id)
                }
            }

            return "success"
        } catch (error) {
            console.log("Update participant error: " + error);
        }
    }

    async viewed(user_id: string, task_id: number)
    {
        const tasks = await this.prisma.notification.findMany({
            where: {
                user_id,
                change: {
                    task_id: task_id
                }
            }
        });

        const viewedTasks = await this.prisma.notification.updateMany({
            where: {
                user_id,
                change: {
                    task_id: task_id
                }
            },
            data: {
                is_viewed: true
            }
        });

        return;
    }

    getFirstWords(input: string, wordCount: number): string {
        let words = input.split(/\s+/);
        return words.slice(0, wordCount).join(" ");
    }

    isISODateString(dateString: string): boolean {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    }


    async update(params: {id: number, name: string, description: string, telegram_id: number})
    {
        const {id, name, description, telegram_id} = params;
        const id_number = Number(id);
        const checkUser = await this.prisma.user.findFirst({
            where: { telegram_id: String(telegram_id) },
            include: {
                taskUser: true                
            }
        });

        if(!checkUser) throw new NotFoundException("User not found");

        const checkTask = await this.prisma.task.findUnique({
            where: { id: id_number }
        });

        if(!checkTask) throw new NotFoundException("Task not found");

        const checkTaskUser = await this.prisma.taskUser.findFirst({
            where: {
                task_id: id_number,
                user_id: String(telegram_id)
            }
        });

        if(!checkTaskUser) throw new BadRequestException("You can not change task");

        const updatedTask = await this.prisma.task.update({
            where: { id: id_number },
            data: {
                description,
                name
            },
            include: {
                taskUser: true
            }
        });

        const change = await this.prisma.taskChange.create({
            data: {
                user_id: String(telegram_id),
                task_id: Number(id),
                type: "edit",
                old_value: checkTask.name + "|" + checkTask.description,
                new_value: name + "|" + description
            }
        });

        if(change) await this.notification.notificationSender(change.id)

        return updatedTask;
    }

    @Cron('0 30 2 * * 1-6', {
        name: "notification_task_priotity",
    })
    async notification_task_priotity() {
        let skip = 0;
        const take = 10;
        const query = {
            is_backlog: false,
            is_archive: false,
            status: {
                name: {
                    notIn: [
                        defaultStatuses.en.completed, 
                        defaultStatuses.ru.completed, 
                        defaultStatuses.uz.completed, 
                    ]
                }
            }
        }
      
        while (true) {
          const tasks = await this.prisma.task.findMany({
            where: query,
            include: {
                taskChange: {
                    select: {
                        id: true,
                        created_at: true,
                    },
                    orderBy: { created_at: 'desc' },
                    take: 1
                },
                taskUser: {
                    include: {
                        user: true
                    }
                },
                project: {
                    include: {
                        group: true
                    }
                },
                user: true
            },
            skip,
            take,
          });

          if (tasks.length === 0) break;
          await this.notification.notification_task_priotity(tasks);
          skip += take;
        }

        return;
    } 

    @Cron('0 40 2 * * 1-1', {
        name: "send_weekly_status"
    })
    // @Cron('0 * * * * *', {
    //     name: "send_weekly_status"
    // })
    async send_weekly_status() {
        console.log('run');
        
        const { startOfWeek, endOfWeek } = this.getWeekRange();
        console.log({ startOfWeek, endOfWeek });
        const projects = await this.prisma.project.findMany({
            where: {
                tasks: {
                    some: {
                        taskChange: {
                            some: {
                                created_at: {
                                    lte: endOfWeek,
                                    gte: startOfWeek,
                                }
                            }
                        },
                    }
                }
            },
            include: {
                project_roles: {
                    include: {
                        users: {
                            include: { user: true }
                        }
                    }
                },
                group: true,
                tasks: {
                    include: {
                        status: true,
                        taskUser: {
                            include: { user: true }
                        },
                        taskChange: true
                    }
                }
            }
        });

        console.log("project count", projects.length);
        
        if(projects.length)
        {
            for (const project of projects) {
                const project_name = project.name + " | " + project.group.name;
                const days = this.getDateName(startOfWeek) + " - " + this.getDateName(endOfWeek);
                const { 
                    todo,
                    progress,
                    testing,
                    completed,
                    cancelled,
                    users
                } = this.taskCounter(project.tasks);
                
                if(project.project_roles.length)
                {
                    for (const role of project.project_roles) {
                        if(role.name === "admin")
                        {
                            for (const chatUser of role.users) {
                                await this.notification.send_analytics({
                                        project_name,
                                        days,
                                        todo,
                                        progress,
                                        testing,
                                        completed,
                                        cancelled,
                                        users
                                    }, chatUser.user_id
                                )
                            }
                        }
                    }
                }
            }
        }
        return;
    }

    taskCounter(list: any[]) 
    {
        let todo: number = 0;
        let progress: number = 0;
        let testing: number = 0;
        let completed: number = 0;
        let cancelled: number = 0;
        const users: any = {};
        if(list.length) 
        {
            list.map(item => {
                switch (item.status.order) {
                    case 1:
                        todo+=1;
                        break;
                    case 2:
                        progress+=1;
                        break;
                    case 3:
                        testing+=1;
                        break;
                    case 4:
                        completed+=1;
                        break;
                    case 5:
                        cancelled+=1;
                        break;
                }

                item.taskUser.map(taskUser => {
                    if(users[taskUser.user_id])
                    {
                        switch (item.status.order) {
                            case 1:
                                users[taskUser.user_id].todo+=1;
                                break;
                            case 2:
                                users[taskUser.user_id].progress+=1;
                                break;
                            case 3:
                                users[taskUser.user_id].testing+=1;
                                break;
                            case 4:
                                users[taskUser.user_id].completed+=1;
                                break;
                            case 5:
                                users[taskUser.user_id].cancelled+=1;
                                break;
                        }
                         
                    }else{
                        users[taskUser.user_id] = {
                            name: taskUser.user.name,
                            username: taskUser.user.username,
                            todo: 0,
                            progress: 0,
                            testing: 0,
                            completed: 0,
                            cancelled: 0
                        }
                    }
                })
            });
        }
            
        return {
            todo,
            progress,
            testing,
            completed,
            cancelled,
            users
        };
    }


    getWeekRange() {
        const date = new Date()
        const startOfWeek = new Date();
        startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? - 6 : 1));
        startOfWeek.setHours(0, 0, 0, 0); 
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); 
        endOfWeek.setHours(23, 59, 59, 999); 
    
        return { startOfWeek, endOfWeek };
    }

    getDateName(dateString){
        const date = new Date(dateString);

        const months = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December"
        };

        const day = date.getDate();
        const month = months[date.getMonth() + 1];

        return `${day} ${month}`;
    }


    async send_weekly_status_maual(project_id: number) {
        const { startOfWeek, endOfWeek } = this.getWeekRange();
        const project = await this.prisma.project.findFirst({
            where: {
                id: project_id,
            },
            include: {
                project_roles: {
                    include: {
                        users: {
                            include: { user: true }
                        }
                    }
                },
                group: true,
                tasks: {
                    where: {
                        taskChange: {
                            some: {
                                created_at: {
                                    lte: endOfWeek,
                                    gte: startOfWeek,
                                }
                            }
                        }
                    },
                    include: {
                        status: true,
                        taskUser: {
                            include: { user: true }
                        },
                        taskChange: {
                            where: {
                                created_at: {
                                    lte: endOfWeek,
                                    gte: startOfWeek,
                                }
                            }
                        }
                    }
                }
            }
        });

        console.log(project);
        

        const project_name = project.name + " | " + project.group.name;
        const days = this.getDateName(startOfWeek) + " - " + this.getDateName(endOfWeek);
        const { 
            todo,
            progress,
            testing,
            completed,
            cancelled,
            users
        } = this.taskCounter(project.tasks);
        if(project.project_roles.length)
        {
            for (const role of project.project_roles) {
                if(role.name === "admin")
                {
                    for (const chatUser of role.users) {
                        await this.notification.send_analytics({
                                project_name,
                                days,
                                todo,
                                progress,
                                testing,
                                completed,
                                cancelled,
                                users
                            }, chatUser.user_id
                        )
                    }
                }
            }
        }
        return;
    }
}