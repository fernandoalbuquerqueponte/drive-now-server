-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
