import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { PrismaService } from '../../prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '../auth/enums/role.enum';

describe('JobService', () => {
  let service: JobService;

  const mockPrisma = {
    company: { findUnique: jest.fn() },
    worker: { findUnique: jest.fn() },
    job: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), updateMany: jest.fn(), delete: jest.fn() },
    jobOffer: { findFirst: jest.fn(), findMany: jest.fn() },
    review: { findFirst: jest.fn() },
  };

  const mockCompany = { id: 1, userId: 10, city: 'Paris' };
  const mockJob = {
    id: 1, title: 'Serveur', description: 'Service en salle', salary: 12,
    start_time: '2026-08-01T09:00:00Z', end_time: '2026-08-01T17:00:00Z',
    status: 'OPEN', companyId: 1, company: mockCompany, jobOffers: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<JobService>(JobService);
    jest.clearAllMocks();
  });

  // ─── CREATE ───
  describe('create', () => {
    const dto = { title: 'Serveur', description: 'Service', salary: 12, start_time: '2026-08-01T09:00:00Z', end_time: '2026-08-01T17:00:00Z' };

    it('devrait créer un job et le retourner', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.job.create.mockResolvedValue(mockJob);
      const result = await service.create(dto as any, 10);
      expect(mockPrisma.job.create).toHaveBeenCalledWith({ data: { ...dto, companyId: 1 } });
      expect(result).toEqual(mockJob);
    });

    it('devrait lever NotFoundException si la company n\'existe pas', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(null);
      await expect(service.create(dto as any, 99)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── FIND BY USER ID ───
  describe('findByUserId', () => {
    it('devrait retourner les jobs de la company avec les jobOffers PENDING', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.job.findMany.mockResolvedValue([mockJob]);
      const result = await service.findByUserId(10);
      expect(result).toEqual([mockJob]);
    });

    it('devrait lever NotFoundException si la company n\'existe pas', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(null);
      await expect(service.findByUserId(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── FIND ALL ───
  describe('findAll', () => {
    it('devrait retourner les jobs OPEN pour un WORKER', async () => {
      mockPrisma.job.findMany.mockResolvedValue([mockJob]);
      const result = await service.findAll({ id: 5, role: Role.WORKER });
      expect(result).toEqual([mockJob]);
    });

    it('devrait retourner uniquement ses propres jobs pour une COMPANY', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.job.findMany.mockResolvedValue([mockJob]);
      const result = await service.findAll({ id: 10, role: Role.COMPANY });
      expect(result).toEqual([mockJob]);
    });

    it('devrait filtrer par titre si un terme de recherche est fourni', async () => {
      mockPrisma.job.findMany.mockResolvedValue([mockJob]);
      await service.findAll({ id: 5, role: Role.WORKER }, 'Serveur');
      const callArg = mockPrisma.job.findMany.mock.calls[0][0];
      expect(callArg.where.OR).toBeDefined();
    });
  });

  // ─── FIND ONE ───
  describe('findOne', () => {
    it('devrait retourner le job avec isWorker=true si l\'utilisateur est un worker', async () => {
      mockPrisma.job.findUnique.mockResolvedValue(mockJob);
      mockPrisma.worker.findUnique.mockResolvedValue({ id: 2, userId: 5 });
      mockPrisma.jobOffer.findFirst.mockResolvedValue(null);
      const result = await service.findOne(1, 5);
      expect(result.isWorker).toBe(true);
      expect(result.alreadyApplied).toBe(false);
      expect(result.canApply).toBe(true);
    });

    it('devrait retourner alreadyApplied=true si le worker a déjà postulé', async () => {
      mockPrisma.job.findUnique.mockResolvedValue(mockJob);
      mockPrisma.worker.findUnique.mockResolvedValue({ id: 2, userId: 5 });
      mockPrisma.jobOffer.findFirst.mockResolvedValue({ id: 1, status: 'PENDING' });
      const result = await service.findOne(1, 5);
      expect(result.alreadyApplied).toBe(true);
      expect(result.canApply).toBe(false);
    });

    it('devrait retourner isWorker=false si l\'utilisateur est une company', async () => {
      mockPrisma.job.findUnique.mockResolvedValue(mockJob);
      mockPrisma.worker.findUnique.mockResolvedValue(null);
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.review.findFirst.mockResolvedValue(null);
      const result = await service.findOne(1, 10);
      expect(result.isWorker).toBe(false);
      expect(result.hasReviewed).toBe(false);
    });

    it('devrait lever NotFoundException si le job n\'existe pas', async () => {
      mockPrisma.job.findUnique.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── UPDATE ───
  describe('update', () => {
    it('devrait mettre à jour le job si la company est propriétaire et aucun candidat actif', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.job.findUnique.mockResolvedValue(mockJob);
      mockPrisma.worker.findUnique.mockResolvedValue(null);
      mockPrisma.company.findUnique.mockResolvedValueOnce(mockCompany);
      mockPrisma.review.findFirst.mockResolvedValue(null);
      mockPrisma.jobOffer.findFirst.mockResolvedValue(null);
      mockPrisma.jobOffer.findMany.mockResolvedValue([]);
      mockPrisma.job.update.mockResolvedValue({ ...mockJob, title: 'Chef' });
      const result = await service.update(1, { title: 'Chef' } as any, 10);
      expect(result.title).toBe('Chef');
    });

    it('devrait lever ForbiddenException si la company n\'est pas propriétaire', async () => {
      mockPrisma.company.findUnique.mockResolvedValue({ id: 99, userId: 10 });
      mockPrisma.job.findUnique.mockResolvedValue(mockJob);
      mockPrisma.worker.findUnique.mockResolvedValue(null);
      mockPrisma.company.findUnique.mockResolvedValueOnce({ id: 99, userId: 10 });
      mockPrisma.review.findFirst.mockResolvedValue(null);
      mockPrisma.jobOffer.findFirst.mockResolvedValue(null);
      await expect(service.update(1, {} as any, 10)).rejects.toThrow(ForbiddenException);
    });

    it('devrait lever ForbiddenException s\'il existe des candidatures actives', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.job.findUnique.mockResolvedValue(mockJob);
      mockPrisma.worker.findUnique.mockResolvedValue(null);
      mockPrisma.review.findFirst.mockResolvedValue(null);
      mockPrisma.jobOffer.findFirst.mockResolvedValue(null);
      mockPrisma.jobOffer.findMany.mockResolvedValue([{ id: 1, status: 'PENDING' }]);
      await expect(service.update(1, {} as any, 10)).rejects.toThrow(ForbiddenException);
    });
  });

  // ─── REMOVE ───
  describe('remove', () => {
    it('devrait supprimer le job si la company est propriétaire et aucun candidat actif', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.job.findUnique.mockResolvedValue(mockJob);
      mockPrisma.worker.findUnique.mockResolvedValue(null);
      mockPrisma.review.findFirst.mockResolvedValue(null);
      mockPrisma.jobOffer.findFirst.mockResolvedValue(null);
      mockPrisma.jobOffer.findMany.mockResolvedValue([]);
      mockPrisma.job.delete.mockResolvedValue(mockJob);
      const result = await service.remove(1, 10);
      expect(mockPrisma.job.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockJob);
    });

    it('devrait lever ForbiddenException s\'il existe des candidatures actives', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.job.findUnique.mockResolvedValue(mockJob);
      mockPrisma.worker.findUnique.mockResolvedValue(null);
      mockPrisma.review.findFirst.mockResolvedValue(null);
      mockPrisma.jobOffer.findFirst.mockResolvedValue(null);
      mockPrisma.jobOffer.findMany.mockResolvedValue([{ id: 1, status: 'PENDING' }]);
      await expect(service.remove(1, 10)).rejects.toThrow(ForbiddenException);
    });
  });
});
