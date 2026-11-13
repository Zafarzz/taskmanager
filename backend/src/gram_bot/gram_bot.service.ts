import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { GroupService } from 'src/group/group.service';
import { ProjectService } from 'src/project/project.service';
// import { StatusService } from 'src/status/status.service';
import { TaskService } from 'src/task/task.service';
import { UserService } from 'src/user/user.service';
import { TelegramClient, Api } from 'telegram';
import { NewMessage } from 'telegram/events';
import { StringSession } from 'telegram/sessions';
import * as fs from 'fs';
import * as path from 'path';
import { CustomFile } from 'telegram/client/uploads';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma.service';
// import { EditedMessage } from 'telegram/events/EditedMessage';
import { EventBuilder } from 'telegram/events/common';
import { TagService } from 'src/tag/tag.service';

interface InitTask {
    topic: { title: string; id: number };
    message_id: number;
    user_id: number;
    name: string;
    project_id: number;
}

@Injectable()
export class GramBotService implements OnModuleInit {
    private readonly apiId: number = parseInt(process.env.TELEGRAM_API_ID, 10);
    private readonly apiHash: string = process.env.TELEGRAM_API_HASH;
    private readonly botToken: string = process.env.TELEGRAM_BOT_TOKEN;
    private readonly client?: TelegramClient;
    private readonly logger = new Logger(GramBotService.name);

    constructor(
        private readonly taskService: TaskService,
        private readonly userService: UserService,
        private readonly groupService: GroupService,
        // private readonly statusService: StatusService,
        private readonly projectService: ProjectService,
        private readonly notificationService: NotificationService,
        private readonly prisma: PrismaService,
        private readonly tag: TagService
    ) {
        if (!this.shouldSkipBotConnection()) {
          const stringSession = new StringSession('');
          this.client = new TelegramClient(stringSession, this.apiId, this.apiHash, {
            connectionRetries: 5,
            retryDelay: 600
          });
        }
    }

    private shouldSkipBotConnection(): boolean {
        return (
            process.env.DISABLE_GRAM_BOT === 'true' ||
            !this.apiId ||
            isNaN(this.apiId) ||
            !this.apiHash ||
            this.apiHash === '1234qwertyuiop' ||
            !this.botToken ||
            this.botToken.includes('EXAMPLEBOTTOKEN')
        );
    }

    async onModuleInit() {
        if (this.shouldSkipBotConnection() || !this.client) {
            this.logger.warn('Skipping Telegram bot startup (placeholder/missing credentials or DISABLE_GRAM_BOT=true).');
            return;
        }
        this.logger.log('Connecting to Telegram...');
        await this.connectToTelegram();
    }

    private async connectToTelegram() {
        let retries = 0;
        const maxRetries = 3;
        const baseDelay = 1500; 
    
        while (retries < maxRetries) {
          try {
            await this.client.start({
              botAuthToken: this.botToken,
            });
            this.logger.log('Connected to Telegram!');
    
            this.client.addEventHandler(this.handleNewMessage.bind(this), new NewMessage({}));
            // this.client.addEventHandler(this.handleNewReaction.bind(this), new EditedMessage({}));
            this.client.addEventHandler(this.handleDoneReaction.bind(this), new EventBuilder({}));

            this.logger.log('Bot is up and running!');
            return; 
          } catch (error) {
            this.logger.error(`Failed to connect to Telegram: ${error.message}`);
            if (error.code === 420 && error.errorMessage === 'FLOOD') {
              const waitTime = error.seconds * 1000;
              this.logger.warn(`FloodWaitError: Waiting for ${waitTime / 1000} seconds`);
              await this.delay(waitTime);
              retries++;
              await this.delay(baseDelay * Math.pow(2, retries));
            } else {
              this.logger.error(`Unexpected error: ${error.message}`);
              break;
            }
          }
        }
    }

    private async handleDoneReaction(event)
    {
        if(event)
        {
            if(event.className === "UpdateBotMessageReaction" && event.newReactions.length &&  event.newReactions[0].emoticon === '👍'){
                this.doneTask(event.msgId, Number(event.actor.userId), -1, true)
            }else if(event.className === "UpdateChannelParticipant" && Number(event.userId) === 7273527869)
            {
                console.log("event");
                console.log(event);
                await this.addBotToChannel(Number(event.channelId));
            }
        }
    }

    private async handleNewMessage(event: any) {
        const message = event.message;
        
        if (!message) return;
        const chatId = message?.peerId;
        const messageId = message.id;
        const messageText: string = message.message;
        let topic: any;
        console.log(`Received message: ${messageText}`);
        if (messageText !== "/start") 
        {
            const initGroup = await this.getChannel(message.peerId.channelId);
            if(initGroup) topic = await this.getChannelTopics(message.peerId.channelId, messageId);
        }

        switch (messageText)
        {
            case "Plan Jet 🚀":
                await this.pinPermission(chatId.channelId, messageId)
                break;
            case "/start": 
                await Promise.all([
                    this.sendPermissionImage(message.peerId.userId)
                ]);
                break;
            case "/dashboard@plan_jet_bot":
            case "/dashboard": 
                await this.notificationService.addBotToChannel(chatId.channelId, 'dashboard', topic);
                await this.removeMessage(chatId.channelId, messageId);
                break;
            case "/commands@plan_jet_bot":
            case "/commands": 
                await this.notificationService.addBotToChannel(chatId.channelId, 'commands', topic);
                await this.removeMessage(chatId.channelId, messageId);
                break;
            
            case "/add@plan_jet_bot":
            case "/add":
                if(message.replyTo && topic)
                {
                    await this.createTask(chatId, message.replyTo.replyToMsgId, message.fromId.userId, topic, messageId);
                }else{
                    await this.sendMessage(chatId, "Task not found", messageId);
                }
                break;
            case "/done@plan_jet_bot":
            case "/done":
                if (message.replyTo && topic) {
                    await this.doneTask(message.replyTo.replyToMsgId, message.fromId.userId, messageId);
                    await this.removeMessage(chatId.channelId, messageId);
                } else {
                    await this.sendMessage(chatId, "Task not found", messageId);
                }
                break;

            default:
                if (message.replyTo) await this.commentCreate(message.replyTo.replyToMsgId, message.fromId.userId, messageId, messageText);
                if((messageText.includes("#task") || messageText.includes("#backlog")) && topic) await this.createTask(chatId, messageId, message.fromId.userId, topic, 0);
        }
    }

    private async doneTask(messageId: number, userId: number, doneMessageId: number, byEmoji?: boolean)
    {
        try {
            const task = await this.prisma.task.findFirst({
                where: {
                    message_id: messageId
                },
                include: {
                    project: true
                }
            });
            if(!task) return;
            const result = await this.taskService.updateStatus(userId, -1, task.id);
            if(result?.message === "Status successfully changed")
            {
                const emojiSended = await this.client.invoke(
                    new Api.messages.SendReaction({
                        peer: `-100${task.project.group_id}`,
                        msgId: Number(messageId),
                        //   @ts-ignore
                        reaction: [new Api.ReactionEmoji({emoticon:"👍"})]
                    })
                );
                if(emojiSended && !byEmoji)
                {
                    await this.removeMessage(task.project.group_id, doneMessageId)
                }
            }
    
        } catch (error) {
            console.log("Create task error " + error);
            throw error; 
        }
    }

    private async createTask(chatId: any, messageId: number, userId: number, topic: {title?: string, id: number, name?: string, topic_id?: number}, doneMessageId: number)
    {
        try {
            const message: any = await this.client.getMessages(chatId, {ids: messageId, limit: 1});

            if(message.length === 1 && message[0] === undefined)
            {
                await this.sendMessage(chatId, "Bot is not admin, Please check admin permissions", messageId);
                return
            }

            const usernameRegex = /@\w+/g;
            const usernames =  message[0].message.match(usernameRegex);
            const messageText =  message[0].message.replace(usernameRegex, '').trim();
            const is_backlog = messageText.includes("#backlog");
            const text = messageText.replace(/#task\s*/, '');
            const tags = text.match(/#\w+/g);
            const resultText = text.replace(/#[\w]+/g, '').trim();
            const participant = (usernames && usernames.length > 0) ? usernames.map((username: string) => username.slice(1)) : [userId];

            const task = await this.taskService.init({
                topic_id: String(topic.topic_id ? topic.topic_id : topic.id),
                group_id: String(chatId.channelId),
                user_id: String(userId),
                topic_title: topic.title ? topic.title : topic.name,
                message_id: Number(messageId),
                name: resultText,
                participant,
                is_backlog
            });

            await Promise.all([
                this.client.invoke(
                    new Api.messages.SendReaction({
                        peer: `-100${task.project.group_id}`,
                        msgId: Number(messageId),
                        //   @ts-ignore
                        reaction: [new Api.ReactionEmoji({emoticon:"🤝"})]
                    })
                ),
                doneMessageId && this.removeMessage(task.project.group_id, doneMessageId),
                this.tag.connectTask(task.id, tags)
            ]);
            
        } catch (error) {
            console.log("Create task error " + error);
        }
    }    

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async sendMessage(chatId: any, message: string, replyTo?: number)
    {
        try {
            await this.client.sendMessage(chatId, {
                message,
                replyTo: Number(replyTo),
              });
        } catch (error) {
            this.logger.error(`Failed to send message: ${error.message}`);
        }
    }

    private async getChannel(id: number){
        try {
            if(!id) return;
            const result: any = await this.client.invoke(
                new Api.channels.GetChannels({
                    id: [id],
                })
            ); 
              
            if(result?.chats.length)
            {
                const checkGroup = result.chats[0];
                await this.groupService.init({id: checkGroup.id, name: checkGroup.title});
                await this.groupUser(id, checkGroup.accessHash);
            }
            
        } catch (error) {
            console.log("Get getChannel error ", error);
        }

        return true
    }

    private async groupUser(channelId: number, accessHash: any)
    {
        try {
            const result: any = await this.client.invoke(
                new Api.channels.GetParticipants({
                    channel: channelId,
                    filter: new Api.ChannelParticipantsRecent(),
                    offset: 0,
                    limit: 50,
                    hash: accessHash,
                })
            );

            if(result?.count > 0)
            {
                const botUsers = [];
                for (const user of result.users) {
                    if (!user.bot) {
                        const checkUser = await this.userService.init({
                            id: user.id,
                            first_name: user.firstName,
                            language_code: user.langCode,
                            username: user.username,
                        });
    
                        if (checkUser) {
                            botUsers.push(user.id);
                        }
                    }
                }
    
                if (botUsers.length > 0) {
                    await this.userService.checkUserFromGroup(String(channelId), result.users);
                    await this.groupService.checkUsers(botUsers, channelId, result.participants);
                }
            }

        } catch (error) {
            console.log("Get groupUser error ", error);
            throw error; 
        }
    }

    private async getChannelTopics(channelId: number, messageId: number)
    {
        try {
            const result: any = await this.client.invoke(
                new Api.channels.GetMessages({
                    channel: channelId,
                    //  @ts-ignore
                    id: [messageId],
                })
            );

            if(result?.topics?.length)
            {
                const topic = result.topics[0];
                await this.projectService.init({groupId: channelId, id: topic.id, name: topic.title});
                return topic;
            }
            return await this.projectService.init({groupId: channelId, id: 1, name: "General"})
        } catch (error) {
            console.log("Get topics error " + error);
        }
    }

    private async sendPermissionImage(userId: number)
    {
        const photos = [ 
            "1.1chat.png", 
            "2.1chat.png", 
            "3.1chat.png", 
            "4.1chat.png", 
            "5.1chat.png"
        ];

        const permissions = photos.map((photo) => {
            const filePath = path.join(__dirname, '..', "../public/" + photo);
            const file = fs.readFileSync(filePath);
            return {
                filePath,
                file
            }
        });

        try {
            await this.client.sendFile(userId, {
                file: permissions.map(({ filePath, file }) => new CustomFile("permissions.png", fs.statSync(filePath).size, "", file)) ,
                caption: `PlanJet — это Open-Source проект менеджер в ваш Telegram чат.\n\nС нашим инструментом вы легко сможете планировать и управлять рабочими процессами прямо внутри групповых чатов Telegram 💻Подробнее на карточках ⬆️\n\nДля того, чтобы начать пользоваться ботом, добавьте его в вашу рабочую группу.`,
            });
        } catch (error) {
            console.log("Send permissions image error: " + error);
        }
    }

    private async removeMessage(channel: string, messageId: number)
    {
        try {
            return await this.client.invoke(
                new Api.channels.DeleteMessages({
                  channel: channel,
                  id: [messageId],
                })
            );
        } catch (error) {
            console.log("remove message: " + error.message);
        }
    }

    private async commentCreate(messageId: number, userId: number, commentId: number, text: string)
    {
        const user_id_str = String(userId);
        const message_id_str = String(messageId);
        const comment_id_str = String(commentId);

        const taskOrComment = await this.prisma.task.findFirst({
            where: {
                OR: [
                    { message_id: Number(messageId) },
                    { taskComment: { some: { message_id: message_id_str } } }
                ]
            },
            include: {
                taskComment: {
                    where: {
                        message_id: message_id_str
                    }
                }
            }
        });

        const taskId = taskOrComment?.id || taskOrComment?.taskComment[0]?.task_id;

        if (taskId) {
            const comment = await this.prisma.taskComment.create({
                data: {
                    task_id: taskId,
                    user_id: user_id_str,
                    message_id: comment_id_str,
                    comment: text
                }
            });
    
            if (comment) {
                await this.prisma.taskChange.create({
                    data: {
                        user_id: user_id_str,
                        task_id: taskId,
                        type: "comment",
                        old_value: "comment",
                        new_value: text
                    }
                });
            }
        }
    }

    private async addBotToChannel(channelId: number)
    {
        const photos = [ 
            "1.1group.png", 
            "2.1group.png", 
            "3.1group.png", 
            "4.1group.png"
        ];

        const permissions = photos.map((photo) => {
            const filePath = path.join(__dirname, '..', "../public/" + photo);
            const file = fs.readFileSync(filePath);
            return {
                filePath,
                file
            }
        });

        const data: any = {
            file: permissions.map(({ filePath, file }) => new CustomFile("permissions.png", fs.statSync(filePath).size, "", file)) ,
            caption: `PlanJet — это Open-Source проект менеджер в ваш Telegram чат.\n\nС нашим инструментом вы легко сможете планировать и управлять рабочими процессами прямо внутри групповых чатов Telegram 💻\n\nО том как пользоваться вы можете изучить на карточках ⬆️\n\nНажмите на кнопку Open в закрепленном сообщении, чтобы открыть мини-приложение.`,
        }

        try {
            const sended = await this.client.sendFile(Number(channelId), data);
            if(sended) await this.notificationService.pinnerMessage(channelId);
        } catch (error) {
            console.log("Send permissions image error: " + error);
        }
    }

    private async pinPermission(channelId: number, messageId: number)
    {
        try {
            await this.client.invoke(
                new Api.messages.UpdatePinnedMessage({
                  peer: Number(channelId),
                  id: Number(messageId),
                  unpin: false,
                  pmOneside: true,
                })
            );
        } catch (error) {
            console.log("pin Permission: " + error);
        }
    }

    async setBotGroupAdmin()
    {
        if (!this.client) {
            return { ok: false, message: 'Telegram bot client is disabled' };
        }
        const result = await this.client.invoke(
            new Api.bots.SetBotGroupDefaultAdminRights({
              adminRights: new Api.ChatAdminRights({
                changeInfo: true,
                postMessages: true,
                editMessages: true,
                deleteMessages: true,
                banUsers: true,
                inviteUsers: false,
                pinMessages: true,
                addAdmins: false,
                anonymous: true,
                manageCall: true,
                other: true,
              }),
            })
          );
          console.log(result); 
        return result;
    }
}
