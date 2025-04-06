import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Lead } from "./models/lead.model";
import { Services } from "./models/services.enum";
import { RegisterInput } from "./dto/register.input";
import { ErrorMessages } from "../../common/constants/error-messages";
import { RegisterResponse } from "./dto/register.response";

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async register(input: RegisterInput): Promise<RegisterResponse> {
    const { name, email, mobile, postcode, services } = input;

    const userExists = await this.prisma.lead.findUnique({
      where: { email }
    })

    if (userExists) {
      throw new ConflictException(ErrorMessages.EMAIL_ALREADY_EXISTS);
    }

    const lead = await this.prisma.lead.create({
      data: {
        name,
        email,
        mobile,
        postcode,
        services
      }
    });

    return {
      success: true,
      id: lead.id,
      email: lead.email
    } as RegisterResponse
  }

  async getLeads(): Promise<Lead[]> {
    const leads = await this.prisma.lead.findMany();

    return leads.map(lead => ({
      ...lead,
      services: lead.services as Services[],
    }));
  }

  async getLead(id: number): Promise<Lead> {
    const lead = await this.prisma.lead.findUnique({
      where: { id }
    })

    if (!lead) {
      throw new NotFoundException(`Lead with id ${id} not found`)
    }
    
    return {
      ...lead,
      services: lead.services as Services[]
    }
  }
}