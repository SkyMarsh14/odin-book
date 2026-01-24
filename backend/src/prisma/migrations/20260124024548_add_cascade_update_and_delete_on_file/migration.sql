-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('Post', 'Profile', 'Comment');

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "content" DROP NOT NULL;

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "public_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "type" "FileType" NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_postId_key" ON "File"("postId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
