import { Category, DeviceStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsNotEmpty()
  tagNumber: string;

  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @IsEnum(DeviceStatus)
  @IsNotEmpty()
  status: DeviceStatus;

  @IsString()
  @IsOptional()
  remark?: string;
}
