-- AddForeignKey
ALTER TABLE "UserCases" ADD CONSTRAINT "UserCases_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
