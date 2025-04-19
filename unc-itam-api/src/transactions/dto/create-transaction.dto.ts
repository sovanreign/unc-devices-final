import { TransactionStatus } from '@prisma/client';
import { Type } from 'class-transformer';
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

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  borrowedDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  returnDate?: Date;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status: TransactionStatus;
}
