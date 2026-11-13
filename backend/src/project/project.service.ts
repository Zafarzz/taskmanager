import { Injectable, NotFoundException } from '@nestjs/common';
import { CatchErrorDecorator } from 'src/decorators/catch.error.decorator';
import { PrismaService } from 'src/prisma.service';
import { StatusService } from 'src/status/status.service';

@Injectable()
export class ProjectService {

    defaultProjectRoles = [
        // "member",
        // "manager",
        // "owner",
        "user",
        "admin",
    ]

    constructor(
        private readonly prisma: PrismaService,
        private readonly statusService: StatusService
    ){}

    async init(props: {
        id: number,
        groupId: number,
        name: string
    }){
        const { groupId, name, id } = props;

        const query = {
            where: {
                group_id: String(groupId),
                name,
            },
            include: {
                statuses: true,
                tasks: {
                    include: {
                        user: true
                    }
                },
                project_roles: true,
            }
        }

        let check = await this.prisma.project.findFirst(query);

        if (!check) 
        {
            const newProject = await this.prisma.project.create({
                data: {
                    topic_id: String(id),
                    group_id: String(groupId),
                    name,
                }
            });  

            if(newProject)
            {
                await this.statusService.defaultMaker(newProject.id, 'en');
                await this.initprojectRoles(newProject.id);
            }

            return await this.prisma.project.findFirst(query)
        }else if(!check.project_roles.length){
            await this.initprojectRoles(check.id);
        }

        return check
    }

    async main(group_id: number)
    {
        try {
            const group = await this.prisma.group.findUnique({
                where: {
                    id: String(group_id)
                }
            });

            if(!group) throw new NotFoundException("Group");

            return await this.prisma.project.findMany({
                where: {
                    group_id: String(group_id),
                },
                include: {
                    tasks: {
                        include: {
                            user: true,
                            status: true
                        }
                    },
                    statuses: true,
                }
            });
        } catch (error) {
            console.log("Error Project main: " + error);
        }
    }

    async showById(props: {project_id: number, status?: number, user_ids?: string[], backlog?: boolean})
    {
        const  {project_id, backlog} = props;
        let {status, user_ids} = props;
        if(!status)
        {
            const statusId = await this.prisma.status.findFirst({
                where: {
                    project_id: Number(project_id),
                    order: 1
                }
            });
            if(statusId)
            {
                status = statusId.id
            }else{
                status = 0
            } 
        }

        // const queryCode: any = {
        //     project_id: Number(project_id),
        //     status_id: Number(status),
        //     is_archive: false,
        //     is_backlog: false,
        // }

        // if(backlog)
        // {
        //     delete queryCode.status_id;
        //     queryCode.is_backlog = true;
        // }

        // if(user_ids.length > 0)
        // {
        //     const user = await this.prisma.user.findMany({
        //         where: {
        //             telegram_id: {
        //                 in: user_ids
        //             }
        //         },
        //     });
        //     if(!user.length) throw new NotFoundException("User not found");
        //     queryCode.taskUser = {
        //         some: {
        //             user_id: {
        //                 in: user_ids
        //             }
        //         }
        //     }
        // }
  
        try {
            const project: any = await this.prisma.project.findUnique({
                where: {
                    id: Number(project_id)
                },
                include: {
                    project_roles: true,
                    statuses: true,
                    group: {
                        include: {
                            projects: true
                        }
                    }
                }
            });

            let mono_topic = false;

            let users = await this.prisma.user.findMany({
                where: {
                    groupUsers: {
                        some: {
                            group: {
                                projects: {
                                    some: {
                                        id: Number(project_id)
                                    }
                                }
                            }
                        }
                    }
                },
                include: {
                    project_users: {
                        include: {
                            role: true
                        }
                    }
                }
            });

            if(users.length)
            {
                const coveredUsers = []
                for (const user of users) {
                    const coveredUser: any = {
                        telegram_id: user.telegram_id,
                        name: user.name,
                        username: user.username
                    }

                    let role = user.project_users.find(u => u.project_id === Number(project_id))
                    if(role)
                    {
                        coveredUser.role_id = role.role_id;
                        coveredUser.role = role.role.name;
                    }else{
                        const performer = project.project_roles.find(r => r.name === "member");
                        if(performer)
                        {
                            await this.connectRole(Number(project_id), Number(user.telegram_id), performer.id);
                            coveredUser.role_id = performer.id;
                            coveredUser.role = "member";
                        }
                    }
                    coveredUsers.push(coveredUser)
                }
                project.users = coveredUsers;
            }

            if(!project)  return [];

            if (project.group.projects.length === 1) {
                mono_topic = true;
            }
            project.group = {
                id: project.group_id,
                name: project.group.name
            }
            project.mono_topic = mono_topic;

            return project;
        } catch (error) {
            console.log("Project show by id: " + error);
        }
    }

    async showByIdTasks(props: {project_id: number, status?: number, user_ids?: string[], backlog?: boolean})
    {
        const  {project_id, backlog} = props;
        let {status, user_ids} = props;
        if(!status)
        {
            const statusId = await this.prisma.status.findFirst({
                where: {
                    project_id: Number(project_id),
                    order: 1
                }
            });
            if(statusId)
            {
                status = statusId.id
            }else{
                status = 0
            } 
        }

        const queryCode: any = {
            project_id: Number(project_id),
            status_id: Number(status),
            is_archive: false,
            is_backlog: false,
        }

        if(backlog)
        {
            delete queryCode.status_id;
            queryCode.is_backlog = true;
        }

        if(user_ids.length > 0)
        {
            const user = await this.prisma.user.findMany({
                where: {
                    telegram_id: {
                        in: user_ids
                    }
                },
            });
            if(!user.length) throw new NotFoundException("User not found");
            queryCode.taskUser = {
                some: {
                    user_id: {
                        in: user_ids
                    }
                }
            }
        }
  
        try {
            const project: any = await this.prisma.project.findUnique({ where: { id: Number(project_id) } });

            const tasks = await this.prisma.task.findMany({
                where: queryCode,
                include: {
                    user: true,
                    status: true,
                    taskComment: true,
                    taskUser: {
                        include: { user: true }
                    }
                },
                orderBy: [
                    { priority: 'desc' } 
                ],
            });

            if(!project)  return [];

            return tasks ? tasks : [];
        } catch (error) {
            console.log("Project tasks error: " + error);
        }
    }

    async deleteFunc(id: number)
    {
            const check = await this.prisma.project.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    tasks: {
                        include: {
                            taskChange: true,
                            taskComment: true,
                            taskUser: true
                        }
                    },
                    statuses: true,
                    project_roles: true,
                    project_users: true,
                }
            });
            if(!check) throw new NotFoundException("Project not found");

            if (check.tasks.length > 0) {
                for (const task of check.tasks) {
                    try {
                        await this.prisma.notification.deleteMany({
                            where: { change: { task_id: Number(task.id) } }
                        });

                        await this.prisma.taskComment.deleteMany({
                            where: { task_id: Number(task.id) }
                        });
            
                        await this.prisma.taskChange.deleteMany({
                            where: { task_id: Number(task.id) }
                        });
            
                        await this.prisma.taskUser.deleteMany({
                            where: { task_id: Number(task.id) }
                        });

                        await this.prisma.taskTag.deleteMany({
                            where: { task_id: Number(task.id) }
                        });
            
                        await this.prisma.task.delete({
                            where: { id: Number(task.id) }
                        });
                    } catch (error) {
                        console.log("Project task delete error: " + error);
                    }
                }
            }
            
            if (check.statuses.length > 0) {              
                try {
                    await this.prisma.status.deleteMany({
                        where: {
                            project_id: check.id
                        },
                    });
                } catch (error) {
                    console.log("Project status delete error: " + error);
                }
            }

            if (check.project_users.length > 0) {
                try {
                    await this.prisma.projectUser.deleteMany({
                        where: {
                            project_id: check.id
                        },
                    });
                } catch (error) {
                    console.log("Project project_roles delete error: " + error);
                }
            }   
            
            if (check.project_roles.length > 0) {
                try {
                    await this.prisma.projectRole.deleteMany({
                        where: {
                            project_id: check.id
                        },
                    });
                } catch (error) {
                    console.log("Project project_roles delete error: " + error);
                }
            }

            await this.prisma.project.delete({
                where: {
                    id: Number(check.id)
                }
            })

        return "Successfully deleted"
    }

    async notification(id: number, type: string, value: boolean)
    {
        const project = await this.prisma.project.findUnique({
            where: {
                id: Number(id)
            }
        });

        if(!project) throw new NotFoundException("Project not found");

        const data: any = {};

        switch (type) {
            case "is_selected":
                data.is_selected = value;
                break;
            case "create":
            case "comment":
            case "edit":
            case "archive":
            case "delete":
                if (value) {
                    const permissionArray: string[] = JSON.parse(project.projectNotificationPermissions);
                    if (!permissionArray.includes(type)) {
                        permissionArray.push(type);
                    }
                    data.projectNotificationPermissions = JSON.stringify(permissionArray);
                
                } else {
                    const permissionArray: string[] = JSON.parse(project.projectNotificationPermissions);
                    const updatedArray = permissionArray.filter(item => item !== type);
                    data.projectNotificationPermissions = JSON.stringify(updatedArray);
                }
                break;
            case "todo":
            case "in_progress":
            case "testing":
            case "completed":
                const permissionArray: string[] = JSON.parse(project.statusNotificationPermissions);
                if (value) {
                    if (!permissionArray.includes(type)) { permissionArray.push(type); }
                    data.statusNotificationPermissions = JSON.stringify(permissionArray);
                } else {
                    const updatedArray = permissionArray.filter(item => item !== type);
                    data.statusNotificationPermissions = JSON.stringify(updatedArray);
                }
                break;
        }

        // if(type === 'create')
        // {
        //     data.add_permission = value
        // }else if(type === 'status')
        // {
        //     data.status_permission = value
        // }else if(type === 'comment')
        // {
        //     data.comment_permission = value
        // }else if(type === 'is_selected')
        // {
        //     data.is_selected = value
        // }else if(type === 'edit')
        // {
        //     data.edit_permission = value
        // }
        // else if(type === 'archive')
        // {
        //     data.archive_permission = value
        // }
        // else if(type === 'delete')
        // {
        //     data.delete_permission = value
        // }

        try {
            return await this.prisma.project.update({
                where: {
                    id: Number(id)
                },
                data
            })
        } catch (error) {
            console.log("Edit permission error " + error);
        }
    }

    async archives(id: number)
    {
        return await this.prisma.task.findMany({
            where: {
                project_id: Number(id),
                is_archive: true
            },
            include: {
                status: true,
            }
        });
    }

    @CatchErrorDecorator()
    async notification_all(id: number, value: boolean)
    {
        const project = await this.prisma.project.findUnique({
            where: {
                id: Number(id)
            }
        });

        if(!project) throw new NotFoundException("Project not found");
        let projectNotificationPermissions = JSON.stringify([]);
        let permissions = JSON.parse(project.projectNotificationPermissions)[0];

        console.log(permissions);
        

        if(JSON.parse(project.projectNotificationPermissions).includes("comment")) 
        {
            if(value) 
            {
                projectNotificationPermissions = JSON.stringify(["comment", "create", "edit", "archive", "unarchive", "delete"]);
            }else{
                projectNotificationPermissions = JSON.stringify(["comment"]);
            } 
        } else {
            if(value) 
            {
                projectNotificationPermissions = JSON.stringify(["create", "edit", "archive", "unarchive", "delete"]);
            } 
        }
        
        return await this.prisma.project.update({
            where: {
                id: project.id
            },
            data: {
                projectNotificationPermissions
            }
        });
    }

    async notification_status_all(id: number, value: boolean)
    {
        try {
            const project = await this.prisma.project.findUnique({
                where: {
                    id: Number(id)
                }
            });
    
            if(!project) throw new NotFoundException("Project not found");

            let statusNotificationPermissions = JSON.stringify([]);

            if(value) statusNotificationPermissions = JSON.stringify(["todo", "in_progress", "testing", "completed"]);
            
            return await this.prisma.project.update({
                where: {
                    id: project.id
                },
                data: {
                    statusNotificationPermissions
                }
            });
            
        } catch (error) {
            console.log("notification_all", error);
        }
    }

    @CatchErrorDecorator()
    async initprojectRoles(project_id: number)
    {
        return await this.prisma.projectRole.createMany({
            data: this.defaultProjectRoles.map(name => ({project_id, name}))
        })
    }

    @CatchErrorDecorator()
    async addRole(project_id: number, name: string)
    {
        const check = await this.prisma.projectRole.findFirst({
            where: {
                project_id,
                name
            }
        });

        if(!check)
        {
            return await this.prisma.projectRole.create({
                data: {
                    project_id,
                    name
                }
            })
        }

        return check;
    }

    @CatchErrorDecorator()
    async removeRole(project_id: number, name: string)
    {
        const check = await this.prisma.projectRole.findFirst({
            where: {
                project_id,
                name
            }
        });

        if(!check)
        {
            throw new NotFoundException("Project Role not found");
        }

        return await this.prisma.projectRole.delete({
            where: {
                id: check.id
            }
        });
    }

    @CatchErrorDecorator()
    async connectRole(project_id: number, user_id: number, role_id: number)
    {
        const check = await this.prisma.projectUser.findFirst({
            where: {
                project_id,
                user_id: String(user_id),
            }
        });

        if(!check)
        {
            return await this.prisma.projectUser.create({
                data: {
                    project_id,
                    user_id: String(user_id),
                    role_id
                }
            })
        }

        return await this.prisma.projectUser.update({
            where: {
                id: check.id
            },
            data: {
                project_id,
                user_id: String(user_id),
                role_id
            }
        });
    }
}
