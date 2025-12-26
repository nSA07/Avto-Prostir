import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { instanceToPlain } from 'class-transformer';
import { isUUID } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existUser) throw new BadRequestException('Користувач з таким email вже існує');

    const user = this.userRepository.create({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
    });

    const savedUser = await this.userRepository.save(user);

    return instanceToPlain(savedUser);
  }

  async findOne(idOrEmail: string) {
    const where = isUUID(idOrEmail)
      ? { id: idOrEmail }
      : { email: idOrEmail };

    const user = await this.userRepository.findOne({
      where: [where]
    });
    if (!user) throw new UnauthorizedException('Користувач не знайдений');

    return (user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    if ('password' in updateUserDto) {
      delete updateUserDto.password;
    }

    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepository.save(user);

    return instanceToPlain(updatedUser);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    await this.userRepository.remove(user);

    return { message: `User with id ${user.email} has been removed` };
  }
}
