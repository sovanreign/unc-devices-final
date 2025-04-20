import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DevicesService {
  constructor(private db: DatabaseService) {}

  create(createDeviceDto: CreateDeviceDto) {
    return this.db.device.create({
      data: createDeviceDto,
    });
  }

  findAll(q?: string) {
    let where: Prisma.DeviceWhereInput = {};

    if (q) {
      where.OR = [
        { model: { contains: q, mode: 'insensitive' } },
        { tagNumber: { contains: q, mode: 'insensitive' } },
        { serialNumber: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.db.device.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.db.device.findUniqueOrThrow({
      where: { id },
    });
  }

  update(id: string, updateDeviceDto: UpdateDeviceDto) {
    return this.db.device.update({
      where: { id },
      data: updateDeviceDto,
    });
  }

  remove(id: string) {
    return this.db.device.delete({
      where: { id },
    });
  }
}
