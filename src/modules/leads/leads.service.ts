import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Lead } from "./models/lead.model";
import { Services } from "./models/services.enum";

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeads(): Promise<Lead[]> {
    const leads = await this.prisma.lead.findMany();

    return leads.map(lead => ({
      ...lead,
      services: lead.services as Services[],
    }));
  }
}