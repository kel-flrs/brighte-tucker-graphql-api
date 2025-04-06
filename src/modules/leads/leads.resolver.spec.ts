import { Test, TestingModule } from '@nestjs/testing';
import { LeadsResolver } from './leads.resolver';
import { LeadsService } from './leads.service';
import { mockLead, mockLeads } from './__mocks__/lead.mock';
import { Services } from './models/services.enum';
import { RegisterResponse } from './dto/register.response';
import { mockRegisterInput } from './__mocks__/register.mock';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../../common/constants/error-messages';
import { Lead } from './models/lead.model';

describe('LeadsResolver', () => {
  let resolver: LeadsResolver;
  let service: LeadsService;

  // Mock data for tests
  const leads = mockLeads;
  const lead = mockLead;
  const registerInput = mockRegisterInput;

  beforeEach(async () => {
    // Create testing module with mocked dependencies
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsResolver,
        {
          provide: LeadsService,
          useValue: {
            register: jest.fn(),
            getLeads: jest.fn(),
            getLead: jest.fn()
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

  describe('register', () => {
    it('should return a successful registration response', async () => {
      // Arrange
      const mockSuccessResponse = {
        success: true,
        id: 4,
        email: 'johndoe@gmail.com'
      } as RegisterResponse

      jest.spyOn(service, 'register').mockResolvedValue(mockSuccessResponse);

      // Act
      const result = await resolver.register(registerInput);

      // Assert
      expect(service.register).toHaveBeenCalledTimes(1);
      expect(service.register).toHaveBeenCalledWith(registerInput);
      expect(result).toEqual(mockSuccessResponse);
      expect(result.success).toBe(true);
      expect(result.id).toBe(mockSuccessResponse.id);
      expect(result.email).toBe(mockSuccessResponse.email);
    });

    it('should handle registration failure from service', async () => {
      jest.spyOn(service, 'register').mockRejectedValue(
        new ConflictException(ErrorMessages.EMAIL_ALREADY_EXISTS)
      );
    
      // Act & Assert
      await expect(resolver.register(mockRegisterInput)).rejects.toThrow(ConflictException);
      expect(service.register).toHaveBeenCalledTimes(1);
      expect(service.register).toHaveBeenCalledWith(mockRegisterInput);
    });

    it('should propagate exceptions from the service', async () => {
      // Arrange
      const errorMessage = 'Unexpected error during registration';
      jest.spyOn(service, 'register').mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(resolver.register(mockRegisterInput)).rejects.toThrow(errorMessage);
      expect(service.register).toHaveBeenCalledTimes(1);
      expect(service.register).toHaveBeenCalledWith(mockRegisterInput);
    });
  });

  describe('getLeads', () => {
    it('should return an array of leads', async () => {
      // Arrange
      const mappedLeads = leads.map(lead => ({
        ...lead,
        services: lead.services as Services[]
      }));

      jest.spyOn(service, 'getLeads').mockResolvedValue(mappedLeads);

      // Act
      const result = await resolver.getLeads();

      // Assert
      expect(service.getLeads).toHaveBeenCalledTimes(1);
      expect(result).toEqual(leads);
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

  describe('getLead', () => {
    it('should retrieve a lead by ID when it exists', async () => {
      // Arrange
      const leadId = 2;
      const mappedLead = {
        ...lead,
        services: lead.services as Services[]
      } as Lead

      jest.spyOn(service, 'getLead').mockResolvedValue(mappedLead);

      // Act
      const result = await resolver.getLead(leadId);

      // Assert
      expect(service.getLead).toHaveBeenCalledTimes(1);
      expect(service.getLead).toHaveBeenCalledWith(leadId);
      expect(result).toEqual(mappedLead);
      expect(result.id).toBe(leadId);
      expect(result.email).toBe(mappedLead.email);
      expect(result.services).toEqual(mappedLead.services);
    });

    it('should propagate NotFoundException when lead does not exist', async () => {
      // Arrange
      const leadId = 999;
      const notFoundError = new NotFoundException(`Lead with id ${leadId} not found`);
      jest.spyOn(service, 'getLead').mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(resolver.getLead(leadId)).rejects.toThrow(NotFoundException);
      await expect(resolver.getLead(leadId)).rejects.toThrow(`Lead with id ${leadId} not found`);
      expect(service.getLead).toHaveBeenCalledTimes(2);
      expect(service.getLead).toHaveBeenCalledWith(leadId);
    });

    it('should propagate unexpected errors from the service', async () => {
      // Arrange
      const leadId = 2;
      const unexpectedError = new Error('Unexpected database error');
      jest.spyOn(service, 'getLead').mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(resolver.getLead(leadId)).rejects.toThrow('Unexpected database error');
      expect(service.getLead).toHaveBeenCalledTimes(1);
      expect(service.getLead).toHaveBeenCalledWith(leadId);
    });
  });
});