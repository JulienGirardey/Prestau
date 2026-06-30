import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { PrismaService } from '../../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReviewService', () => {
  let service: ReviewService;

  const mockPrisma = {
    review: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
  };

  const mockReview = {
    id: 1, rating: 4, comment: 'Très bon worker', jobOfferId: 1,
    reviewerId: 10, revieweeId: 5, reviewerType: 'COMPANY', revieweeType: 'WORKER',
  };

  const createDto = {
    rating: 4, comment: 'Très bon worker', jobOfferId: 1,
    reviewerId: 10, revieweeId: 5, reviewerType: 'COMPANY', revieweeType: 'WORKER',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<ReviewService>(ReviewService);
    jest.clearAllMocks();
  });

  // ─── CREATE ───
  describe('create', () => {
    it('devrait créer un avis et le retourner', async () => {
      mockPrisma.review.findFirst.mockResolvedValue(null);
      mockPrisma.review.create.mockResolvedValue(mockReview);
      const result = await service.create(createDto as any, 10);
      expect(result).toEqual(mockReview);
      expect(mockPrisma.review.create).toHaveBeenCalledWith({
        data: { ...createDto, reviewerId: 10 },
      });
    });

    it('devrait lever BadRequestException si l\'utilisateur s\'auto-évalue', async () => {
      await expect(service.create({ ...createDto, revieweeId: 10 } as any, 10)).rejects.toThrow(BadRequestException);
    });

    it('devrait lever BadRequestException si un avis existe déjà pour cette candidature', async () => {
      mockPrisma.review.findFirst.mockResolvedValue(mockReview);
      await expect(service.create(createDto as any, 10)).rejects.toThrow(BadRequestException);
    });

    it('ne devrait pas appeler review.create si l\'utilisateur s\'auto-évalue', async () => {
      try { await service.create({ ...createDto, revieweeId: 10 } as any, 10); } catch {}
      expect(mockPrisma.review.create).not.toHaveBeenCalled();
    });
  });
});
