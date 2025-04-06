import { Test, TestingModule } from '@nestjs/testing';
import { LeadsResolver } from './leads.resolver';
import { LeadsService } from './leads.service';
import { Lead } from './models/lead.model';
import { Services } from './models/services.enum';

describe('LeadsResolver', () => {
  let resolver: LeadsResolver;
  let service: LeadsService;

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
        LeadsResolver,
        {
          provide: LeadsService,
          useValue: {
            getLeads: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = moduleRef.get<LeadsResolver>(LeadsResolver);
    service = moduleRef.get<LeadsService>(LeadsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getLeads', () => {
    it('should return an array of leads', async () => {
      // Arrange
      jest.spyOn(service, 'getLeads').mockResolvedValue(mockLeads);

      // Act
      const result = await resolver.getLeads();

      // Assert
      expect(service.getLeads).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLeads);
      expect(result.length).toBe(3);
      expect(result[0].id).toBe(1);
      expect(result[1].name).toBe('Sophie Taylor');
      expect(result[2].email).toBe('liam.nguyen@hotmail.com');
    });

    it('should return an empty array when no leads exist', async () => {
      // Arrange
      jest.spyOn(service, 'getLeads').mockResolvedValue([]);

      // Act
      const result = await resolver.getLeads();

      // Assert
      expect(service.getLeads).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should propagate errors from the service', async () => {
      // Arrange
      const errorMessage = 'Failed to fetch leads';
      jest.spyOn(service, 'getLeads').mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(resolver.getLeads()).rejects.toThrow(errorMessage);
      expect(service.getLeads).toHaveBeenCalledTimes(1);
    });
  });
});