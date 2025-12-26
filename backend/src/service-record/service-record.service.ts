import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRecord } from './entities/service-record.entity';
import { CreateServiceRecordDto } from './dto/create-service-record.dto';
import { Car } from '@cars/entities/car.entity';

@Injectable()
export class ServiceRecordService {
  constructor(
    @InjectRepository(ServiceRecord) private serviceRecordRepository: Repository<ServiceRecord>,
    @InjectRepository(Car) private carRepository: Repository<Car>,
  ) {}

  async create( carId: string, dto: CreateServiceRecordDto) {
    const car = await this.carRepository.findOneBy({ id: carId });
    if (!car) throw new NotFoundException('Автомобіль не знайдено');

    if (dto.mileage < car.currentMileage) {
      throw new BadRequestException(
        `Пробіг (${dto.mileage}) не може бути меншим за поточний (${car.currentMileage} км)`
      );
    }

    const record = this.serviceRecordRepository.create({
      ...dto,
      car: car,
    });

    const savedRecord = await this.serviceRecordRepository.save(record);

    car.currentMileage = dto.mileage;
    await this.carRepository.save(car);

    return savedRecord;
  }

  async remove(id: string) {
    const record = await this.serviceRecordRepository.findOne({
      where: { id },
      relations: ['car'],
    });

    if (!record) {
      throw new NotFoundException('Запис обслуговування не знайдено');
    }

    const car = record.car;
    await this.serviceRecordRepository.remove(record);
    const highestRemainingRecord = await this.serviceRecordRepository.findOne({
      where: { car: { id: car.id } },
      order: { mileage: 'DESC' },
    });
    if (highestRemainingRecord) {
      car.currentMileage = highestRemainingRecord.mileage;
      await this.carRepository.save(car);
    } 

    return { message: 'Запис успішно видалено' };
  }

  async update(id: string, dto: Partial<CreateServiceRecordDto>) {    
    const record = await this.serviceRecordRepository.findOne({
      where: { id },
      relations: ['car'],
    }); 
    if (!record) {
      throw new NotFoundException('Запис обслуговування не знайдено');
    }
    Object.assign(record, dto);
    const updatedRecord = await this.serviceRecordRepository.save(record);
    const car = record.car;
    const highestRecord = await this.serviceRecordRepository.findOne({
      where: { car: { id: car.id } },
      order: { mileage: 'DESC' }, 
    });
    if (highestRecord) {
      car.currentMileage = highestRecord.mileage;
      await this.carRepository.save(car);
    }
    return updatedRecord;
  }

  async findOne(id: string) {
    const record = await this.serviceRecordRepository.findOne({
      where: { id },
      relations: ['items']
    });

    if (!record) {
      throw new NotFoundException('Запис обслуговування не знайдено');
    }

    return record;
  }

}