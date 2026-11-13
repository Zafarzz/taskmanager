import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CatchErrorDecorator } from 'src/decorators/catch.error.decorator';
import { languages } from 'src/local/static';
import { PrismaService } from 'src/prisma.service';
import { defaultStatuses } from 'src/status/status.default';


@Injectable()
export class NotificationService {
    private url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    constructor(
        private readonly prisma: PrismaService
    ){
      
    }

    async notificationSender(id: number)
    {
        const change = await this.prisma.taskChange.findUnique({
            where: {id},
            include: {
                task: {
                    include: {
                        project: {
                            include: {
                                group: true
                            }
                        },
                        taskUser: {
                            include: {
                                user: true
                            }
                        },
                        user: true,
                        status: true,
                    }
                },
                user: true
            }
        });
        
        if(!change) return;

        const projectPermissions = JSON.parse(change.task.project.projectNotificationPermissions);
        const statusPermissions = JSON.parse(change.task.project.statusNotificationPermissions);

        const users = change.task.taskUser.map(user => user.user);
        const userNames = change.task.taskUser.map(user => user.user.name);
        const changed_user = change.user.name;
        const user_name = change.user.username;
        const project = change.task.project.group.name + " | " + change.task.project.name;
        const author = change.task.user.name;
        const text = change.task.name;
        // const description = change.task.description;
        const deadline = change.task.deadline;
        // const old_value = change.old_value;
        const new_value = change.new_value;
        const status = change.task.status.name;
        const topic = Number(change.task.project.topic_id);

        let message:string;

        switch (change.type) {
            case "created":
                if(projectPermissions.includes('create')) message = await this.notificationTask({author, users: userNames, project, changed_user, text});
                break;
            case "edit":
            case "delete": 
                if(projectPermissions.includes(change.type)) message = await this.notificationTask({author: change.user.name, users: userNames, project, changed_user, text});
                break;

            case "comment":
                if(projectPermissions.includes("comment")) message = await this.notificationComment({author: change.user.name, users: userNames, project, changed_user, text, comment: new_value, user_name});
                break;

            case "status":
                switch (status) {
                    case defaultStatuses.en.todo:
                    case defaultStatuses.ru.todo:
                    case defaultStatuses.uz.todo:
                        if(statusPermissions.includes("todo")) message = await this.notificationStatus({author, users: userNames, project, changed_user, text, status, user_name});
                        break;
                    case defaultStatuses.en.progress:
                    case defaultStatuses.ru.progress:
                    case defaultStatuses.uz.progress:
                        if(statusPermissions.includes("in_progress")) message = await this.notificationStatus({author, users: userNames, project, changed_user, text, status, user_name});
                        break;
                    case defaultStatuses.en.test:
                    case defaultStatuses.ru.test:
                    case defaultStatuses.uz.test:
                        if(statusPermissions.includes("testing")) message = await this.notificationStatus({author, users: userNames, project, changed_user, text, status, user_name});
                        break;
                    case defaultStatuses.en.completed:
                    case defaultStatuses.ru.completed:
                    case defaultStatuses.uz.completed:
                        if(statusPermissions.includes("completed")) message = await this.notificationStatus({author, users: userNames, project, changed_user, text, status, user_name});
                        break;
                    default:
                        message = await this.notificationStatus({author, users: userNames, project, changed_user, text, status, user_name});
                        break;
                }
                break;
        
            case "priority":
                message = await this.notificationPriority({author, users: userNames, project, changed_user, text, priority: new_value, user_name});
                break;

            case "participant":
                message = await this.notificationParticipant({author, users: userNames, project, changed_user, text, user_name})

                break;
            case "deadline":
                message = await this.notificationDeadline({author, users: userNames, project, changed_user, text, deadline: new Date(deadline), user_name})
                break;

            case "archive":
                message = await this.notificationArchive({author, users: userNames, project, changed_user, text, user_name})
                break;
            case "unarchive":
                message = await this.notificationUnarchive({author, users: userNames, project, changed_user, text, user_name})
                break;

            default:
                break;
        }

        interface SendData {
            chat_id: string
            text: string
            parse_mode: string
            message_thread_id?: number
            reply_markup?: any
        }
        const data: SendData = {
            chat_id: `-100${change.task.project.group_id}`,
            text: message,
            parse_mode: 'html',
        };

        let inlineKeyboard = this.inlineKeyboard(String(process.env.TELEGRAM_WEB_APP_URL) + `?startapp=tasks_${change.task_id}`, languages.en.open_task);

        if (topic && topic !== 1) data.message_thread_id = topic;
        if (inlineKeyboard) data.reply_markup = inlineKeyboard;

        try {
            if (data.text)
            {
                await axios.post(this.url, data);
                if(users.length)
                {
                    const messages = users.map((user) => ({...data, chat_id: user.telegram_id, message_thread_id: null}));
                    await Promise.all(messages.map((msg) => axios.post(this.url, msg)))
                    await this.prisma.notification.createMany({
                        data: users.map((u) => (
                            {
                                change_id: id, 
                                user_id: u.telegram_id, 
                                is_viewed: false
                            }
                        ))
                    })
                }
            }
        } catch (error) {
            console.log('sended error', error);
        }
    }

    async addBotToChannel(chat_id: number, type: string, topic?: any)
    {
        const lang: string = 'en';
        const data: any = {
            chat_id: `-100${Number(chat_id)}`,
            text: '',
            parse_mode: 'html',
            reply_markup: this.inlineKeyboard(String(process.env.TELEGRAM_WEB_APP_URL), languages[lang].dashboard)
        };
        
        if(topic && topic.id) { 
            let project = await this.prisma.project.findFirst({
                where: {
                    group_id: String(chat_id),
                    topic_id: String(topic.id)
                }
            });
            
            if(!project)
            {
                project = await this.prisma.project.findFirst({
                    where: {
                        group_id: String(chat_id),
                        topic_id: '1'
                    }
                });
            }else{
                data.message_thread_id = topic.id 
            }
            if(project && type === 'commands') data.reply_markup = this.inlineKeyboard(String(process.env.TELEGRAM_WEB_APP_URL) + `?startapp=projects_${project.id}`, languages[lang].open_app)
        }

        try {
            if(type === 'commands')
            {
                data.text = `${languages[lang].manager_commands}

/dashboard ${languages[lang].dashboard}
/commands ${languages[lang].open_app}
/add ${languages[lang].add_task}
/done ${languages[lang].task_done}`;
            }else if(type === 'dashboard'){
                data.text = `<b>Plan Jet 🚀</b> | dashboard`;
            }

            await axios.post(this.url, data);
            return "success";
        } catch (error) {
            console.log("Error add Bot to Channel: " + error);
            console.log(error);
        }
    }

    async pinnerMessage(chat_id: number)
    {
        const data: any = {
            chat_id: `-100${Number(chat_id)}`,
            text: "<b>Plan Jet 🚀</b>",
            parse_mode: 'html',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Open",
                            url: String(process.env.TELEGRAM_WEB_APP_URL)
                        }
                    ]
                ]
            }
        };
        try {
            await axios.post(this.url, data)
        } catch (error) {
            console.log("pinner message error: " + error);
        }
    }

    inlineKeyboard(url: string, text: string = languages.en.dashboard)
    {
        return {
            inline_keyboard: [
                [{
                    text,
                    url
                }]
            ]
        };
    }

    async sendToParticipant(change_id: number, user_id: string)
    {
        const notification = await this.prisma.notification.findFirst({
            where: {
                change_id,
                user_id
            },
            include: {
                change: {
                    include: {
                        task: {
                            include: {
                                project: {
                                    include: {
                                        group: true
                                    }
                                }
                            }
                        },
                        user: true
                    }
                },
                user: true
            }
        });


        const task = notification.change.task;
        const change = notification.change;
        const userLanguage = languages[notification.user.language_code];

        const oldValueStr = change.old_value === "comment" ? change.new_value : `<s>${change.old_value}</s> ➡️  ${change.new_value}`;
        const priorityStr = change.type === 'priority' ? 
        `<s>${userLanguage["priority_data_" + change.old_value]}</s> ➡️  ${userLanguage["priority_data_" + change.new_value]}` : ``;

        const text = `<code>${task.project.group.name} | ${task.project.name}</code>

<b>${task.name}</b> 
        
<b>${change.user.name}:</b> ${change.type === "created" ? 
`${userLanguage.task_created}` : 
`${userLanguage[change.type]}
${oldValueStr}${priorityStr}`}`;


        try {
            const check = await axios.post(this.url, {
                chat_id: user_id,
                text,
                parse_mode: 'html',
                reply_markup: this.inlineKeyboard(String(process.env.TELEGRAM_WEB_APP_URL) + `?startapp=tasks_${notification.change.task_id}`, languages[notification.user.language_code].open_task)
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    @CatchErrorDecorator()
    async notificationStatus(params: {status: string, author: string, users: any[], project: string, changed_user: string, text: string, user_name?: string})
    {
        const { author, project, changed_user, text, user_name} = params;
        let { status, users } = params;
        let list: string = author
        
        if(!this.statuses.includes(status)) status = this.statuses[0];
        if(status === 'Completed') status = 'Completed✅';
        if(users.length) list = users.join(", ");

        return `#changed by ${user_name ? "<a href='https://t.me/" + user_name + "'>" + changed_user +"</a>" : user_name}
${text}

▫️Status: ${status}

Project: ${project}
Author:  ${author}
Participants: ${list}`;
    }

    statuses = [
        'To do',
        'In Progress',
        'Testing',
        'Completed',
        'Cancelled'
    ]

    priorities = {
        1: 'low',
        2: 'middle',
        3: 'high'
    }

    @CatchErrorDecorator()
    async notificationPriority(params: {priority: string, author: string, users: any[], project: string, changed_user: string, text: string,  user_name?: string})
    {
        const { author, project, changed_user, text, user_name} = params;
        let { priority, users } = params;
        let list: string = author
        
        if(users.length) list = users.join(", ");

        return `#changed by ${user_name ? "<a href='https://t.me/" + user_name + "'>" + changed_user +"</a>" : user_name}
${text}

📊Priority: ${this.priorities[priority]}

Project: ${project}
Author:  ${author}
Participants: ${list}`;
    }

    @CatchErrorDecorator()
    async notificationTask(params: {author: string, users: any[], project: string, changed_user: string, text: string})
    {
        const { author, project, text} = params;
        let { users } = params;
        let list: string = author
        
        if(users.length) list = users.join(", ");

        return `#_task
${text}

Project: ${project}
Author:  ${author}
Participants: ${list}`;
    }

    @CatchErrorDecorator()
    async notificationComment(params: {author: string, users: any[], project: string, changed_user: string, text: string, comment: string, user_name?: string})
    {
        const { author, project, text, comment, changed_user, user_name} = params;
        let { users } = params;
        let list: string = author;
        
        if(users.length) list = users.join(", ");

        return `#comment by ${user_name ? "<a href='https://t.me/" + user_name + "'>" + changed_user +"</a>" : user_name}
${text}

💬Comment: ${comment}

Project: ${project}
Author:  ${author}
Participants: ${list}`;
    }

    @CatchErrorDecorator()
    async notificationDeadline(params: {author: string, users: any[], project: string, changed_user: string, text: string, deadline: Date, user_name?: string})
    {
        const { author, project, text, deadline, changed_user, user_name} = params;
        let { users } = params;
        let list: string = author;
        
        if(users.length) list = users.join(", ");

        return `#changed by ${user_name ? "<a href='https://t.me/" + user_name + "'>" + changed_user +"</a>" : user_name}
${text}

🗓Deadline: <b>${deadline}</b>

Project: ${project}
Author:  ${author}
Participants: ${list}`;
    }

    @CatchErrorDecorator()
    async notificationParticipant(params: {author: string, users: any[], project: string, changed_user: string, text: string, user_name?: string})
    {
        const { author, project, text, changed_user, user_name} = params;
        let { users } = params;
        let list: string = author;
        
        if(users.length) list = users.join(", ");

        return `#changed by ${user_name ? "<a href='https://t.me/" + user_name + "'>" + changed_user +"</a>" : user_name}
${text}

👥Participants changed: <b>${list}</b>

Project: ${project}
Author:  ${author}
Participants: ${list}`;
    }

    @CatchErrorDecorator()
    async notificationArchive(params: {author: string, users: any[], project: string, changed_user: string, text: string, user_name?: string})
    {
        const { author, project, text, changed_user, user_name} = params;
        let { users } = params;
        let list: string = author;
        
        if(users.length) list = users.join(", ");

        return `#changed by ${user_name ? "<a href='https://t.me/" + user_name + "'>" + changed_user +"</a>" : user_name}
${text}

🗂️Archived

Project: ${project}
Author:  ${author}
Participants: ${list}`;
    }

    @CatchErrorDecorator()
    async notificationUnarchive(params: {author: string, users: any[], project: string, changed_user: string, text: string, user_name?: string})
    {
        const { author, project, text, changed_user, user_name} = params;
        let { users } = params;
        let list: string = author;
        
        if(users.length) list = users.join(", ");

        return `#changed by ${user_name ? "<a href='https://t.me/" + user_name + "'>" + changed_user +"</a>" : user_name}
${text}

📤Unarchived

Project: ${project}
Author:  ${author}
Participants: ${list}`;
    }

    async notification_task_priotity(tasks: any[])
    {
        const text = {
            uz: "Sizda ustuvor vazifa bor!",
            ru: "У вас есть задача с высоким приоритетом!",
            en: "You have a high priority task!"
        }

        for (const task of tasks) {
            if(task.taskChange.length)
            {
                const priorityDaysMap = {
                    1: 7,
                    2: 3,
                    3: 1
                };
                
                const daysToSubtract = priorityDaysMap[task.priority];
                if (!daysToSubtract || !task.taskUser.length)  return; 
                const ago = new Date();
                ago.setDate(ago.getDate() - daysToSubtract);

                if (ago > new Date(task.taskChange[0].created_at)) {
                    const users = task.taskUser.map(user => user.user.name);
                    const project = task.project.group.name + " | " + task.project.name;
                    const author = task.user.name;
                    let list: string = author;
                    if(users.length) list = users.join(", ");

                    for (const user of task.taskUser) {

                        const sendedText = `${text[user.user.language_code]}
                            
${task.name}
                            
Project: ${project}
Author:  ${author}
Participants: ${list}`;

                        try {
                            await axios.post(this.url, {
                                chat_id: user.user_id,
                                text: sendedText,
                                parse_mode: 'html',
                                reply_markup: this.inlineKeyboard(
                                    `${process.env.TELEGRAM_WEB_APP_URL}?startapp=tasks_${task.id}`,
                                    languages[user.user.language_code].open_task
                                )
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            }
        } 

        return true;
    }

    async send_analytics(data: {
        project_name: string,
        days: string,
        todo: number,
        progress: number,
        testing: number,
        completed: number,
        cancelled: number,
        users: any[]
    }, chat_id: string)
    {
        const { 
            project_name,
            days,
            todo,
            progress,
            testing,
            completed,
            cancelled,
            users
        } = data;
        const dataShaper = Object.values(users).map(element => element)
        const sendedTable = this.create_table(dataShaper)

        const mainText = `#analytics
Project: ${project_name}
--------------------------
🌀Week (${days})


Tasks
--------------------------
📋 To do: ${todo}
⚙️ Progress: ${progress}
🔍 Testing: ${testing}
✅ Completed: ${completed}


${sendedTable}
`;
        try {
            await axios.post(this.url, {
                chat_id: chat_id,
                text: mainText,
                parse_mode: 'html',
            })
        } catch (error) {
            console.log(chat_id);
        }
   
        return true;
    }

    create_table(data: any[]) {
        if(!data.length)
        {
            return `Name T/P/T/C\n--------------------------\n`
        }        

        const maxNameLength = Math.max(...data.map(item => item.name.length));
    
        let table = `Name${" ".repeat(maxNameLength - 4 + 2)}T/P/T/C\n`; 
        table += "--------------------------\n"; 
    
        data.forEach(item => {
            const padding = " ".repeat(maxNameLength - item.name.length + 3);
            table += `<a href='https://t.me/${item.username}'>${item.name}</a>${padding}${item.todo}/${item.progress}/${item.testing}/${item.completed}\n`;
        });
    
        return table;
    }
    
}
