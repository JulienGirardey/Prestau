import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from '../../prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CompanyService', () => {
  let service: CompanyService;

  const mockPrisma = {
    company: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCompany = {
    id: 1,
    userId: 10,
    companyName: 'Le Bistrot',
    address: '12 rue de la Paix',
    city: 'Paris',
    postalCode: 75001,
    siret: '12345678901234',
    phoneNumber: '0600000000',
    establishment_type: 'Restaurant',
  };

  const createDto = {
    companyName: 'Le Bistrot',
    address: '12 rue de la Paix',
    city: 'Paris',
    postalCode: 75001,
    siret: '12345678901234',
    phoneNumber: '0600000000',
    establishment_type: 'Restaurant',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────────────────────
  describe('create', () => {
    it('devrait créer un profil company et le retourner', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(null);
      mockPrisma.company.create.mockResolvedValue(mockCompany);

      const result = await service.create(createDto as any, 10);

      expect(mockPrisma.company.create).toHaveBeenCalledWith({
        data: { ...createDto, userId: 10 },
      });
      expect(result).toEqual(mockCompany);
    });

    it('devrait lever ConflictException si un profil existe déjà pour ce userId', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);

      await expect(service.create(createDto as any, 10)).rejects.toThrow(ConflictException);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // FIND ONE BY USER ID
  // ─────────────────────────────────────────────────────────────
  describe('findOneByUserId', () => {
    it('devrait retourner la company correspondant au userId', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);

      const result = await service.findOneByUserId(10);

      expect(result).toEqual(mockCompany);
    });

    it('devrait lever NotFoundException si aucune company n\'est trouvée', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(null);

      await expect(service.findOneByUserId(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // FIND ONE BY ID
  // ─────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('devrait retourner la company correspondant à l\'id', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCompany);
    });

    it('devrait lever NotFoundException si la company n\'existe pas', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────────────────────
  describe('update', () => {
    it('devrait mettre à jour et retourner la company', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.company.update.mockResolvedValue({ ...mockCompany, city: 'Lyon' });

      const result = await service.update(10, { city: 'Lyon' } as any);

      expect(result.city).toBe('Lyon');
    });

    it('devrait lever NotFoundException si la company n\'existe pas', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(null);

      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // REMOVE
  // ─────────────────────────────────────────────────────────────
  describe('remove', () => {
    it('devrait supprimer la company', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.company.delete.mockResolvedValue(mockCompany);

      const result = await service.remove(10);

      expect(mockPrisma.company.delete).toHaveBeenCalledWith({ where: { userId: 10 } });
      expect(result).toEqual(mockCompany);
    });

    it('devrait lever NotFoundException si la company n\'existe pas', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
