import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { passwordEncryption } from 'src/lib/password-encryption.util';

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

  findAll() {
    return this.db.user.findMany({});
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

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.db.user.update({
      where: {
        id,
      },
      data: updateUserDto,
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
