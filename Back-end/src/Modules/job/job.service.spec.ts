/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { PrismaService } from '../../prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '../auth/enums/role.enum';
// ...existing code...

describe('JobService', () => {
  let service: JobService;
  let prisma: any;

  beforeEach(async () => {
    const delegateMethods = [
      'findUnique', 'findUniqueOrThrow', 'findFirst', 'findFirstOrThrow', 'findMany', 'create', 'createMany', 'createManyAndReturn', 'update', 'updateMany', 'updateManyAndReturn', 'delete', 'deleteMany', 'upsert', 'aggregate', 'groupBy', 'count', 'fields'
    ];
    prisma = {
      job: {},
      company: {},
    };
    delegateMethods.forEach(method => {
      prisma.job[method] = jest.fn();
      prisma.company[method] = jest.fn();
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();
    service = module.get<JobService>(JobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException if job not found', async () => {
      prisma.job.findUnique.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
    it('should return job with worker info', async () => {
      prisma.job.findUnique.mockResolvedValue({ id: 1, company: {}, jobOffers: [] });
      prisma.company.findUnique.mockResolvedValue({ id: 2 });
      const result = await service.findOne(1);
      expect(result.id).toBe(1);
    });
    it('should create job if company exists', async () => {
      prisma.company.findUnique.mockResolvedValue({ id: 2 });
      prisma.job.create.mockResolvedValue({ id: 1 });
      const validDto = {
        title: 'test',
        description: 'desc',
        salary: 1000,
        start_time: '2026-03-10T00:00:00.000Z',
        end_time: '2026-03-11T00:00:00.000Z',
      };
      const result = await service.create(validDto, 1);
      expect(result.id).toBe(1);
    });
  });

  describe('create with valid job dto', () => {
    const validJobDto = {
      title: 'test',
      description: 'desc',
      salary: 1000,
      start_time: '2026-03-10T00:00:00.000Z',
      end_time: '2026-03-11T00:00:00.000Z',
    };
    it('should create a job with valid DTO', async () => {
      prisma.company.findUnique.mockResolvedValue({ id: 2 });
      prisma.job.create.mockResolvedValue({ id: 1 });
      const result = await service.create(validJobDto, 1);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('update', () => {
    const validJobDto = {
      title: 'update',
      description: 'desc',
      salary: 1200,
      start_time: '2026-03-10T00:00:00.000Z',
      end_time: '2026-03-11T00:00:00.000Z',
    };
    it('should throw NotFoundException if company not found', async () => {
      prisma.company.findUnique.mockResolvedValue(null);
      await expect(service.update(1, validJobDto, 1)).rejects.toThrow(NotFoundException);
    });
    it('should throw ForbiddenException if company is not owner', async () => {
      prisma.company.findUnique.mockResolvedValue({ id: 2 });
      service.findOne = jest.fn().mockResolvedValue({ companyId: 3 });
      prisma.job.findUnique.mockResolvedValue({ id: 1, companyId: 3 });
      await expect(service.update(1, validJobDto, 1)).rejects.toThrow(ForbiddenException);
    });
    it('should update job if company is owner', async () => {
      prisma.company.findUnique.mockResolvedValue({ id: 2 });
      service.findOne = jest.fn().mockResolvedValue({ companyId: 2 });
      prisma.job.findUnique.mockResolvedValue({ id: 1, companyId: 2 });
      prisma.job.update.mockResolvedValue({ id: 1 });
      const result = await service.update(1, validJobDto, 1);
      expect(result.id).toBe(1);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if company not found', async () => {
      prisma.company.findUnique.mockResolvedValue(null);
      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });
    it('should throw ForbiddenException if company is not owner', async () => {
      prisma.company.findUnique.mockResolvedValue({ id: 2 });
      service.findOne = jest.fn().mockResolvedValue({ companyId: 3 });
      prisma.job.findUnique.mockResolvedValue({ id: 1, companyId: 3 });
      await expect(service.remove(1, 1)).rejects.toThrow(ForbiddenException);
    });
    it('should delete job if company is owner', async () => {
      prisma.company.findUnique.mockResolvedValue({ id: 2 });
      service.findOne = jest.fn().mockResolvedValue({ companyId: 2 });
      prisma.job.findUnique.mockResolvedValue({ id: 1, companyId: 2 });
      prisma.job.delete.mockResolvedValue({ id: 1 });
      const result = await service.remove(1, 1);
      expect(result.id).toBe(1);
    });
  });
});