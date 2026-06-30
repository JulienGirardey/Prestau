import { Test, TestingModule } from '@nestjs/testing';
import { WorkerService } from './worker.service';
import { PrismaService } from '../../prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('WorkerService', () => {
  let service: WorkerService;

  const mockPrisma = {
    worker: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockWorker = {
    id: 1,
    userId: 10,
    firstName: 'Jean',
    lastName: 'Dupont',
    city: 'Paris',
    postalCode: 75001,
    profession: 'Serveur',
    phoneNumber: '0600000000',
    languages: 'Français',
    skills: 'Service en salle',
    freeDays: ['2026-07-01'],
    busyDays: ['2026-07-02'],
  };

  const createDto = {
    firstName: 'Jean',
    lastName: 'Dupont',
    city: 'Paris',
    postalCode: 75001,
    profession: 'Serveur',
    phoneNumber: '0600000000',
    languages: 'Français',
    skills: 'Service en salle',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkerService>(WorkerService);
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────────────────────
  describe('create', () => {
    it('devrait créer un profil worker et le retourner', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue(null);
      mockPrisma.worker.create.mockResolvedValue(mockWorker);

      const result = await service.create(createDto as any, 10);

      expect(mockPrisma.worker.create).toHaveBeenCalledWith({
        data: { ...createDto, userId: 10 },
      });
      expect(result).toEqual(mockWorker);
    });

    it('devrait lever ConflictException si un profil worker existe déjà', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue(mockWorker);

      await expect(service.create(createDto as any, 10)).rejects.toThrow(ConflictException);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // FIND ONE BY USER ID
  // ─────────────────────────────────────────────────────────────
  describe('findOneByUserId', () => {
    it('devrait retourner le worker correspondant au userId', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue(mockWorker);

      const result = await service.findOneByUserId(10);

      expect(result).toEqual(mockWorker);
    });

    it('devrait lever NotFoundException si aucun worker n\'est trouvé', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue(null);

      await expect(service.findOneByUserId(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // FIND ONE BY ID
  // ─────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('devrait retourner le worker correspondant à l\'id', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue(mockWorker);

      const result = await service.findOne(1);

      expect(result).toEqual(mockWorker);
    });

    it('devrait lever NotFoundException si le worker n\'existe pas', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // GET AVAILABILITY
  // ─────────────────────────────────────────────────────────────
  describe('getAvailability', () => {
    it('devrait retourner les jours libres et occupés du worker', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue(mockWorker);

      const result = await service.getAvailability(10);

      expect(result).toEqual({
        freeDays: ['2026-07-01'],
        busyDays: ['2026-07-02'],
      });
    });

    it('devrait retourner des tableaux vides si le worker n\'a pas de disponibilités', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue({ ...mockWorker, freeDays: null, busyDays: null });

      const result = await service.getAvailability(10);

      expect(result).toEqual({ freeDays: [], busyDays: [] });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // UPDATE AVAILABILITY
  // ─────────────────────────────────────────────────────────────
  describe('updateAvailability', () => {
    it('devrait ajouter une date dans freeDays si status = free', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue({ ...mockWorker, freeDays: [], busyDays: [] });
      mockPrisma.worker.update.mockResolvedValue({ ...mockWorker, freeDays: ['2026-07-10'], busyDays: [] });

      const result = await service.updateAvailability(10, '2026-07-10', 'free');

      expect(result.freeDays).toContain('2026-07-10');
    });

    it('devrait ajouter une date dans busyDays si status = busy', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue({ ...mockWorker, freeDays: [], busyDays: [] });
      mockPrisma.worker.update.mockResolvedValue({ ...mockWorker, freeDays: [], busyDays: ['2026-07-10'] });

      const result = await service.updateAvailability(10, '2026-07-10', 'busy');

      expect(result.busyDays).toContain('2026-07-10');
    });

    it('devrait retirer la date des deux tableaux si status = neutral', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue({ ...mockWorker, freeDays: ['2026-07-10'], busyDays: [] });
      mockPrisma.worker.update.mockResolvedValue({ ...mockWorker, freeDays: [], busyDays: [] });

      const result = await service.updateAvailability(10, '2026-07-10', 'neutral');

      expect(result.freeDays).not.toContain('2026-07-10');
    });

    it('devrait éviter les doublons si la date est déjà dans freeDays', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue({ ...mockWorker, freeDays: ['2026-07-10'], busyDays: [] });
      mockPrisma.worker.update.mockResolvedValue({ ...mockWorker, freeDays: ['2026-07-10'], busyDays: [] });

      await service.updateAvailability(10, '2026-07-10', 'free');

      const updateCall = mockPrisma.worker.update.mock.calls[0][0];
      const freeDays = updateCall.data.freeDays;
      expect(freeDays.filter((d: string) => d === '2026-07-10').length).toBe(1);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────────────────────
  describe('update', () => {
    it('devrait mettre à jour et retourner le worker', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue(mockWorker);
      mockPrisma.worker.update.mockResolvedValue({ ...mockWorker, city: 'Lyon' });

      const result = await service.update(10, { city: 'Lyon' } as any);

      expect(result.city).toBe('Lyon');
    });

    it('devrait lever NotFoundException si le worker n\'existe pas', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue(null);

      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // REMOVE
  // ─────────────────────────────────────────────────────────────
  describe('remove', () => {
    it('devrait supprimer le worker', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue(mockWorker);
      mockPrisma.worker.delete.mockResolvedValue(mockWorker);

      const result = await service.remove(10);

      expect(mockPrisma.worker.delete).toHaveBeenCalledWith({ where: { userId: 10 } });
      expect(result).toEqual(mockWorker);
    });

    it('devrait lever NotFoundException si le worker n\'existe pas', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
