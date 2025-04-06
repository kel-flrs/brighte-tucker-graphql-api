import { Query, Resolver } from "@nestjs/graphql";
import { Lead } from "./models/lead.model";
import { LeadsService } from "./leads.service";

@Resolver(() => Lead)
export class LeadsResolver {
  constructor(private readonly leadsService: LeadsService) {}

  @Query(() => [Lead], { name: 'leads' })
  async getLeads(): Promise<Lead[]> {
    return await this.leadsService.getLeads();
  }
}