import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DatabaseService } from 'src/database/database.service';
import { DeviceStatus } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private db: DatabaseService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    // create the transaction
    const transaction = await this.db.transaction.create({
      data: createTransactionDto,
    });

    // update the device status
    await this.db.device.update({
      where: { id: createTransactionDto.deviceId },
      data: { status: DeviceStatus.InUse },
    });

    // return the transaction
    return transaction;
  }

  findAll() {
    return this.db.transaction.findMany({
      include: {
        borrower: true,
        device: true,
      },
    });
  }

  findOne(id: string) {
    return this.db.transaction.findUniqueOrThrow({
      where: { id },
      include: {
        borrower: true,
        device: true,
      },
    });
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.db.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  remove(id: string) {
    return this.db.transaction.delete({
      where: { id },
    });
  }
}
