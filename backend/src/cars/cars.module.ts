import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car]), 
    UserModule
  ],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService, TypeOrmModule],
})
export class CarsModule {}
