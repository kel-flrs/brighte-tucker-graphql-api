import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { LeadsResolver } from "./leads.resolver";
import { LeadsService } from "./leads.service";

@Module({
  imports: [PrismaModule],
  providers: [LeadsResolver, LeadsService],
})
export class LeadsModule {}