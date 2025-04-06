import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';
import { Services } from './models/services.enum';
import { Lead } from '@prisma/client';
import { mockLeads } from './__mocks__/lead.mock';
import { mockRegisterInput } from './__mocks__/register.mock';
import { ConflictException } from '@nestjs/common';
import { ErrorMessages } from '../../common/constants/error-messages';

describe('LeadsService', () => {
  let service: LeadsService;
  let prismaService: PrismaService;

  // Mock data for tests
  const leads = mockLeads;
  const registerInput = mockRegisterInput;

  beforeEach(async () => {
    // Create testing module with mocked dependencies
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: PrismaService,
          useValue: {
            lead: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = moduleRef.get<LeadsService>(LeadsService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should return a successful registration response', async () => {
      // Arrange
      const mockCreatedLead = {
        id: 4,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        mobile: '9876',
        postcode: '7746',
        services: [Services.DELIVERY, Services.PAYMENT]
      }

      jest.spyOn(prismaService.lead, 'findUnique').mockResolvedValue(null)
      jest.spyOn(prismaService.lead, 'create').mockResolvedValue(mockCreatedLead);

      // Act
      const result = await service.register(registerInput);

      // Assert
      expect(prismaService.lead.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaService.lead.create).toHaveBeenCalledTimes(1);
      expect(prismaService.lead.create).toHaveBeenCalledWith({
        data: {
          name: registerInput.name,
          email: registerInput.email,
          mobile: registerInput.mobile,
          postcode: registerInput.postcode,
          services: registerInput.services
        }
      });
      expect(result.success).toEqual(true)
      expect(result.id).toEqual(mockCreatedLead.id);
      expect(result.email).toEqual(mockCreatedLead.email)
    });

    it('should throw ConflictException if email already exists', async () => {
       // Arrange
       const mockFoundLead = {
        id: 4,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        mobile: '9876',
        postcode: '7746',
        services: [Services.DELIVERY, Services.PAYMENT]
      }

      jest.spyOn(prismaService.lead, 'findUnique').mockResolvedValue(mockFoundLead);

      // Act & Assert
      await expect(service.register(registerInput)).rejects.toThrow(ConflictException);
      await expect(service.register(registerInput)).rejects.toThrow(ErrorMessages.EMAIL_ALREADY_EXISTS);

      expect(prismaService.lead.findUnique).toHaveBeenCalledWith({
        where: { email: registerInput.email }
      });
      expect(prismaService.lead.create).not.toHaveBeenCalled();
    });

    it('should propagate database errors during lead creation', async () => {
      // Arrange
      const databaseError = new Error('Database connection error');
      jest.spyOn(prismaService.lead, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.lead, 'create').mockRejectedValue(databaseError);

      // Act & Assert
      await expect(service.register(registerInput)).rejects.toThrow('Database connection error');
      
      expect(prismaService.lead.findUnique).toHaveBeenCalledWith({
        where: { email: registerInput.email }
      });
      expect(prismaService.lead.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLeads', () => {
    it('should return an array of leads with services as enums', async () => {
      // Arrange
      jest.spyOn(prismaService.lead, 'findMany').mockResolvedValue(leads);

      // Act
      const result = await service.getLeads();

      // Assert
      expect(prismaService.lead.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.lead.findMany).toHaveBeenCalledWith();
      expect(result).toHaveLength(3);
      expect(result[0].services).toEqual([Services.DELIVERY, Services.PAYMENT]);
      expect(result[1].services).toEqual([Services.PICKUP, Services.PAYMENT]);
      expect(result[2].services).toEqual([Services.DELIVERY, Services.PICKUP, Services.PAYMENT]);
    });

    it('should return an empty array when no leads exist', async () => {
      // Arrange
      jest.spyOn(prismaService.lead, 'findMany').mockResolvedValue([]);

      // Act
      const result = await service.getLeads();

      // Assert
      expect(prismaService.lead.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle services properly when they are null or undefined', async () => {
      // Arrange
      const leadsWithNullServices = [
        { 
          id: 3, 
          name: 'Test User', 
          email: 'test@example.com', 
          mobile: '1234',
          postcode: '4000',
          services: null
        } as Lead
      ];
      
      jest.spyOn(prismaService.lead, 'findMany').mockResolvedValue(leadsWithNullServices);

      // Act
      const result = await service.getLeads();

      // Assert
      expect(prismaService.lead.findMany).toHaveBeenCalledTimes(1);
      expect(result[0].services).toEqual(null);
    });

    it('should propagate errors from the Prisma client', async () => {
      // Arrange
      const databaseError = new Error('Database connection failed');
      jest.spyOn(prismaService.lead, 'findMany').mockRejectedValue(databaseError);

      // Act & Assert
      await expect(service.getLeads()).rejects.toThrow('Database connection failed');
      expect(prismaService.lead.findMany).toHaveBeenCalledTimes(1);
    });
  });
});