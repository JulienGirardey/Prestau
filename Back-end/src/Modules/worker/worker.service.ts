import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { PrismaService } from '../../prisma.service';
import { Worker } from '@prisma/client';

@Injectable()
export class WorkerService {
    constructor(private prisma: PrismaService) { }

    // Créer un worker lié à un utilisateur (userId)
    async create(createWorkerDto: CreateWorkerDto, userId: number): Promise<Worker> {
        const existingWorker = await this.prisma.worker.findUnique({
            where: { userId }
        });

        if (existingWorker) {
            throw new ConflictException('Worker profile already exists');
        }

        return this.prisma.worker.create({
            data: {
                ...createWorkerDto,
                userId, // association du worker avec l'utilisateur qui l'a créé (=même token)
            }
        });
    }

    // Trouver un worker par son userId (pour que le worker puisse voir son profil)
    async findOneByUserId(userId: number) {
        const worker = await this.prisma.worker.findUnique({
            where: { userId }
        });
        // Vérifie si un worker avec ce userId existe dans la base de données pour le retourner
        if (!worker) {
            throw new NotFoundException(`Worker not found`);
        }
        return worker;
    }

    // Récupérer les jours libres et occupés d'un worker
    async getAvailability(userId: number) {
        const worker = await this.findOneByUserId(userId); // Vérifie que le worker existe

        return {
            freeDays: worker.freeDays || [],
            busyDays: worker.busyDays || []
        };
    }

    // Mettre à jour le statut d'une date (Disponible, Occupé, Neutre)
    async updateAvailability(userId: number, date: string, status: string) {
        const worker = await this.findOneByUserId(userId);

        // On crée des copies des tableaux actuels pour les manipuler
        let freeDays = worker.freeDays ? [...worker.freeDays] : [];
        let busyDays = worker.busyDays ? [...worker.busyDays] : [];

        // Nettoyage : On retire la date des deux tableaux pour éviter les doublons
        freeDays = freeDays.filter(d => d !== date);
        busyDays = busyDays.filter(d => d !== date);

        // Assignation : On ajoute la date dans le bon tableau selon le nouveau statut
        if (status === 'free') {
            freeDays.push(date);
        } else if (status === 'busy') {
            busyDays.push(date);
        }
        // Si le statut est 'neutral', la date est simplement retirée (étape 1) et n'est pas réajoutée

        // Sauvegarde dans la base de données via Prisma
        const updatedWorker = await this.prisma.worker.update({
            where: { userId },
            data: {
                freeDays,
                busyDays
            }
        });

        return {
            success: true,
            freeDays: updatedWorker.freeDays,
            busyDays: updatedWorker.busyDays
        };
    }

    // Trouver un worker par son id (pour que la company puisse voir le profil d'un worker)
    async findOne(id: number) {
        const worker = await this.prisma.worker.findUnique({
            where: { id }
        });
        // Vérifie si un worker avec cet id existe dans la base de données pour le retourner
        if (!worker) {
            throw new NotFoundException(`Worker not found`);
        }
        return worker;
    }

    // Mettre à jour un worker par son userId (pour que le worker puisse mettre à jour son profil)
    async update(userId: number, updateWorkerDto: UpdateWorkerDto) {
        await this.findOneByUserId(userId); // vérifie que le worker existe

        return this.prisma.worker.update({
            where: { userId },
            data: updateWorkerDto,
        });
    }

    // Supprimer un worker par son userId (pour que le worker puisse supprimer son profil)
    async remove(userId: number) {
        await this.findOneByUserId(userId); // vérifie que le worker existe

        return this.prisma.worker.delete({
            where: { userId }
        });
    }
}