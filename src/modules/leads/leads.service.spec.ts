import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';
import { Services } from './models/services.enum';
import { Lead } from '@prisma/client';

describe('LeadsService', () => {
  let service: LeadsService;
  let prismaService: PrismaService;

  // Mock data for tests
  const mockLeads: Lead[] = [
    { 
      id: 1,
      name: 'James Wilson',
      email: 'james.wilson@gmail.com',
      mobile: '0412 345 678',
      postcode: '2060',
      services: [Services.DELIVERY, Services.PAYMENT]
    } as Lead,
    {
      id: 2,
      name: 'Sophie Taylor',
      email: 'sophie.taylor@outlook.com',
      mobile: '0423 789 456',
      postcode: '3143',
      services: [Services.PICKUP, Services.PAYMENT]
    } as Lead,
    {
      id: 3,
      name: 'Liam Nguyen',
      email: 'liam.nguyen@hotmail.com',
      mobile: '0437 654 321',
      postcode: '4000',
      services: [Services.DELIVERY, Services.PICKUP, Services.PAYMENT]
    } as Lead
  ];

  beforeEach(async () => {
    // Create testing module with mocked dependencies
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: PrismaService,
          useValue: {
            lead: {
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

  describe('getLeads', () => {
    it('should return an array of leads with services as enums', async () => {
      // Arrange
      jest.spyOn(prismaService.lead, 'findMany').mockResolvedValue(mockLeads);

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