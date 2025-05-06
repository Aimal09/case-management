-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_forwardedToMukhtiarkarId_fkey" FOREIGN KEY ("forwardedToMukhtiarkarId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
