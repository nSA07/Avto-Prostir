import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car) private readonly carRepository: Repository<Car>,
  ) {}

  async create(userId: string, createCarDto: CreateCarDto) {
    const existPlateCar = await this.carRepository.findOne({
      where: { plate: createCarDto.plate },
    });

    const existVinCar = await this.carRepository.findOne({
      where: { vin: createCarDto.vin },
    });

    if (existPlateCar) throw new BadRequestException('Автомобіль з такою держ. номером вже існує');
    if (existVinCar) throw new BadRequestException('Автомобіль з таким VIN-кодом вже існує');
    const newCar = {
      name: createCarDto.name,
      year: createCarDto.year,
      plate: createCarDto.plate,
      vin: createCarDto.vin,
      country: createCarDto.country,
      purchaseDate: createCarDto.purchaseDate,
      purchasePrice: createCarDto.purchasePrice,
      currentMileage: createCarDto.currentMileage,
      userId: userId,
    }
    return await this.carRepository.save(newCar);
  }

  async findAll(userId: string) {
    return await this.carRepository.find({
      where: { userId },
      order: { createAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const car = await this.carRepository.findOne({
      where: { id, userId },
      relations: [
        'serviceRecords', 
        'serviceRecords.items' // Завантажуємо позиції для кожного запису ТО
      ],
      order: {
        serviceRecords: {
          date: 'DESC', // Сортуємо: найновіші записи будуть зверху
        }
      }
    });
    
    if (!car) {
      throw new NotFoundException(`Автомобіль з ID ${id} не знайдено`);
    }
    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto, userId: string) {
    const car = await this.findOne(id, userId);
    Object.assign(car, updateCarDto);
    return await this.carRepository.save(car);
  }

  async remove(id: string, userId: string) {
    const car = await this.findOne(id, userId);
    return await this.carRepository.remove(car);
  }
}
