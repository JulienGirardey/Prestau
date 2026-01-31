import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { Basemodel, Prisma } from '@prisma/client';

@Injectable()
export class BasemodelService {
  constructor(private prisma: PrismaService) {}

  async basemodel(
    basemodelWhereUniqueInput: Prisma.BasemodelWhereUniqueInput,
  ): Promise<Basemodel | null> {
    return this.prisma.basemodel.findUnique({
      where: basemodelWhereUniqueInput,
    });
  }

  async basemodels(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BasemodelWhereUniqueInput;
    where?: Prisma.BasemodelWhereInput;
    orderBy?: Prisma.BasemodelOrderByWithRelationInput;
  }): Promise<Basemodel[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.basemodel.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createBasemodel(data: Prisma.BasemodelCreateInput): Promise<Basemodel> {
    return this.prisma.basemodel.create({
      data,
    });
  }

  async updateBasemodel(params: {
    where: Prisma.BasemodelWhereUniqueInput;
    data: Prisma.BasemodelUpdateInput;
  }): Promise<Basemodel> {
    const { where, data } = params;
    return this.prisma.basemodel.update({
      data,
      where,
    });
  }
}