import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DevicesService {
  constructor(private db: DatabaseService) {}

  create(createDeviceDto: CreateDeviceDto) {
    return this.db.device.create({
      data: createDeviceDto,
    });
  }

  findAll() {
    return this.db.device.findMany({});
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
