-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "unread_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "is_seen_by" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
