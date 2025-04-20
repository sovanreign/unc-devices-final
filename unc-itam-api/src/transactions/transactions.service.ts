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
      orderBy: {
        createdAt: 'desc',
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

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.db.transaction.update({
      where: { id },
      data: {
        device: {
          connect: { id: updateTransactionDto.deviceId },
        },
        purpose: updateTransactionDto.purpose,
        borrowedDate: updateTransactionDto.borrowedDate,
        borrowerName: updateTransactionDto.borrowerName,
        returnedDate: updateTransactionDto.returnDate,
      },
    });

    if (updateTransactionDto.returnDate) {
      console.log('IM IN');

      await this.db.device.update({
        where: { id: transaction.deviceId },
        data: { status: 'Available' },
      });

      await this.db.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'Returned',
        },
      });
    }

    return transaction;
  }

  async remove(id: string) {
    const tran = await this.findOne(id);

    await this.db.transaction.delete({
      where: { id },
    });

    await this.db.device.update({
      where: { id: tran.deviceId },
      data: {
        status: 'Available',
      },
    });
  }
}
