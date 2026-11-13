-- CreateEnum
CREATE TYPE "StatusNotificationPermission" AS ENUM ('TODO', 'IN_PROGRESS', 'TESTING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProjectNotificationPermission" AS ENUM ('CREATE', 'EDIT', 'DELETE', 'ARCHIVE', 'COMMENT');

-- CreateTable
CREATE TABLE "User" (
    "telegram_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT,
    "phone" TEXT,
    "language_code" TEXT NOT NULL DEFAULT 'en',

    CONSTRAINT "User_pkey" PRIMARY KEY ("telegram_id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupUser" (
    "group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_selected" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "group_id" TEXT,
    "topic_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notification_lang" TEXT NOT NULL DEFAULT 'en',
    "is_selected" BOOLEAN NOT NULL DEFAULT false,
    "statusNotificationPermissions" TEXT NOT NULL DEFAULT '[]',
    "projectNotificationPermissions" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "status_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "message_id" INTEGER,
    "user_id" TEXT NOT NULL,
    "participants" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3),
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "is_archive" BOOLEAN NOT NULL DEFAULT false,
    "is_backlog" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 2,
    "point" INTEGER,
    "point_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskUser" (
    "task_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TaskChange" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'status',
    "old_value" TEXT NOT NULL,
    "new_value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskComment" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "message_id" TEXT,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "change_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_viewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'member',
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "ProjectRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUser" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ProjectUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskTag" (
    "task_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupUser_group_id_user_id_key" ON "GroupUser"("group_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "TaskUser_task_id_user_id_key" ON "TaskUser"("task_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "TaskTag_task_id_tag_id_key" ON "TaskTag"("task_id", "tag_id");

-- AddForeignKey
ALTER TABLE "GroupUser" ADD CONSTRAINT "GroupUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("telegram_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupUser" ADD CONSTRAINT "GroupUser_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("telegram_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskUser" ADD CONSTRAINT "TaskUser_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskUser" ADD CONSTRAINT "TaskUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("telegram_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskChange" ADD CONSTRAINT "TaskChange_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskChange" ADD CONSTRAINT "TaskChange_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("telegram_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("telegram_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_change_id_fkey" FOREIGN KEY ("change_id") REFERENCES "TaskChange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("telegram_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRole" ADD CONSTRAINT "ProjectRole_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("telegram_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "ProjectRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTag" ADD CONSTRAINT "TaskTag_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTag" ADD CONSTRAINT "TaskTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
