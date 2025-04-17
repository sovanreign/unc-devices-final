import { TransactionStatus } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  borrowerName?: string;

  @IsString()
  @IsOptional()
  borrowerId?: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  purpose: string;

  @IsDate()
  @IsNotEmpty()
  borrowedDate: Date;

  @IsDate()
  @IsOptional()
  returnDate?: Date;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status: TransactionStatus;
}
