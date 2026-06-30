import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt pour éviter les vraies opérations de hachage en test
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let prisma: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;

  // Mock Prisma
  const mockPrisma = {
    users: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
    worker: {
      findUnique: jest.fn(),
    },
  };

  // Mock JwtService
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────────────────────────
  describe('register', () => {
    const registerDto = {
      email: 'test@test.com',
      password: 'Password1!',
      role: 'WORKER' as any,
    };

    it('devrait créer un utilisateur et retourner les tokens', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(null); // pas de doublon
      mockPrisma.users.create.mockResolvedValue({ id: 1, email: registerDto.email, role: registerDto.role });
      mockPrisma.users.update.mockResolvedValue({});
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockJwtService.sign.mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result.user.email).toBe(registerDto.email);
    });

    it('devrait lever ConflictException si l\'email existe déjà', async () => {
      mockPrisma.users.findUnique.mockResolvedValue({ id: 1, email: registerDto.email });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('devrait hasher le mot de passe avant de le stocker', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(null);
      mockPrisma.users.create.mockResolvedValue({ id: 1, email: registerDto.email, role: registerDto.role });
      mockPrisma.users.update.mockResolvedValue({});
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockJwtService.sign.mockReturnValue('token');

      await service.register(registerDto);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────────────
  describe('login', () => {
    const loginDto = { email: 'test@test.com', password: 'Password1!' };
    const mockUser = { id: 1, email: loginDto.email, password: 'hashedPassword', role: 'WORKER', refreshToken: null };

    it('devrait retourner les tokens si les credentials sont valides (WORKER)', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.worker.findUnique.mockResolvedValue({ id: 1, userId: 1 });
      mockPrisma.users.update.mockResolvedValue({});
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashedRefresh');
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });

    it('devrait lever UnauthorizedException si l\'email est introuvable', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('devrait lever UnauthorizedException si le mot de passe est incorrect', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('devrait lever UnauthorizedException si le profil COMPANY n\'existe pas', async () => {
      mockPrisma.users.findUnique.mockResolvedValue({ ...mockUser, role: 'COMPANY' });
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.company.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('devrait lever UnauthorizedException si le profil WORKER n\'existe pas', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.worker.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────────────────────
  describe('logout', () => {
    it('devrait supprimer le refresh token et retourner un message de succès', async () => {
      mockPrisma.users.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.users.update.mockResolvedValue({});

      const result = await service.logout(1);

      expect(mockPrisma.users.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { refreshToken: null },
      });
      expect(result).toEqual({ message: 'Logout successful' });
    });

    it('devrait lever UnauthorizedException si le user n\'existe pas', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(null);

      await expect(service.logout(99)).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // REFRESH TOKEN
  // ─────────────────────────────────────────────────────────────
  describe('refreshToken', () => {
    const mockUser = { id: 1, email: 'test@test.com', role: 'WORKER', refreshToken: 'hashedToken' };

    it('devrait retourner une nouvelle paire de tokens si le refresh token est valide', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 1 });
      mockPrisma.users.findUnique.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue('newHashedToken');
      mockJwtService.sign.mockReturnValue('newToken');
      mockPrisma.users.update.mockResolvedValue({});

      const result = await service.refreshToken('validRefreshToken');

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });

    it('devrait lever UnauthorizedException si le token est invalide', async () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error('invalid'); });

      await expect(service.refreshToken('badToken')).rejects.toThrow(UnauthorizedException);
    });

    it('devrait lever UnauthorizedException si le hash ne correspond pas', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 1 });
      mockPrisma.users.findUnique.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.refreshToken('mismatchToken')).rejects.toThrow(UnauthorizedException);
    });
  });
});
