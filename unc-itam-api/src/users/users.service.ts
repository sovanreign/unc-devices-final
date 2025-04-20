import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { passwordEncryption } from 'src/lib/password-encryption.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    const hashedPassword = await passwordEncryption(password);

    return this.db.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });
  }

  findAll(q?: string) {
    let where: Prisma.UserWhereInput = {};

    if (q) {
      where.OR = [
        { employeeId: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.db.user.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.db.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  findOneByEmail(email: string) {
    return this.db.user.findFirst({
      where: {
        email,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;

    const data = password
      ? { ...rest, password: await passwordEncryption(password) }
      : rest;

    return this.db.user.update({
      where: {
        id,
      },
      data,
    });
  }

  remove(id: string) {
    return this.db.user.delete({
      where: {
        id,
      },
    });
  }
}
