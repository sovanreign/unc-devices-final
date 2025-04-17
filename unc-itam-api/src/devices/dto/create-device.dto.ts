import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category, DeviceStatus } from 'generated/prisma';

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
