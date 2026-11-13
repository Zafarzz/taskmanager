-- CreateTable
CREATE TABLE "NotificationWeekly" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationWeekly_pkey" PRIMARY KEY ("id")
);
