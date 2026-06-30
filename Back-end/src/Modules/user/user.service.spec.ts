import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  const mockPrisma = {
    users: { findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
  };

  const mockUser = {
    id: 1, email: 'test@test.com', role: 'WORKER',
    createdAt: new Date(), updatedAt: new Date(), refreshToken: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  // ─── FIND ONE ───
  describe('findOne', () => {
    it('devrait retourner l\'utilisateur sans le mot de passe', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(mockUser);
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
      expect(result).not.toHaveProperty('password');
    });

    it('devrait lever NotFoundException si l\'utilisateur n\'existe pas', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── UPDATE ───
  describe('update', () => {
    it('devrait mettre à jour l\'email de l\'utilisateur', async () => {
      mockPrisma.users.findUnique
        .mockResolvedValueOnce(mockUser)  // user existe
        .mockResolvedValueOnce(null);      // email pas pris
      mockPrisma.users.update.mockResolvedValue({ ...mockUser, email: 'nouveau@test.com' });
      const result = await service.update(1, { email: 'nouveau@test.com' } as any);
      expect(result.email).toBe('nouveau@test.com');
    });

    it('devrait lever NotFoundException si l\'utilisateur n\'existe pas', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(null);
      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });

    it('devrait lever ConflictException si l\'email est déjà utilisé par un autre compte', async () => {
      mockPrisma.users.findUnique
        .mockResolvedValueOnce(mockUser)                          // user existe
        .mockResolvedValueOnce({ id: 2, email: 'pris@test.com' }); // email pris par id=2
      await expect(service.update(1, { email: 'pris@test.com' } as any)).rejects.toThrow(ConflictException);
    });

    it('devrait autoriser la mise à jour si l\'email appartient au même utilisateur', async () => {
      mockPrisma.users.findUnique
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({ id: 1, email: 'test@test.com' }); // même id
      mockPrisma.users.update.mockResolvedValue(mockUser);
      const result = await service.update(1, { email: 'test@test.com' } as any);
      expect(result).toEqual(mockUser);
    });
  });

  // ─── REMOVE ───
  describe('remove', () => {
    it('devrait supprimer l\'utilisateur et le retourner', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(mockUser);
      mockPrisma.users.delete.mockResolvedValue(mockUser);
      const result = await service.remove(1);
      expect(mockPrisma.users.delete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } })
      );
      expect(result).toEqual(mockUser);
    });

    it('devrait lever NotFoundException si l\'utilisateur n\'existe pas', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
