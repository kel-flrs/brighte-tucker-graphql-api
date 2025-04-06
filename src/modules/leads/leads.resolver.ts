import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Lead } from "./models/lead.model";
import { LeadsService } from "./leads.service";
import { RegisterResponse } from "./dto/register.response";
import { RegisterInput } from "./dto/register.input";

@Resolver(() => Lead)
export class LeadsResolver {
  constructor(private readonly leadsService: LeadsService) {}

  @Mutation(() => RegisterResponse)
  async register(@Args('input') input: RegisterInput): Promise<RegisterResponse> {
    return await this.leadsService.register(input);
  }
  
  @Query(() => [Lead], { name: 'leads' })
  async getLeads(): Promise<Lead[]> {
    return await this.leadsService.getLeads();
  }
}