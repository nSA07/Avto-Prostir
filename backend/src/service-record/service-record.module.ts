import { Module } from '@nestjs/common';
import { ServiceRecordService } from './service-record.service';
import { ServiceRecordController } from './service-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRecord } from './entities/service-record.entity';
import { ServiceItem } from './entities/service-item.entity';
import { CarsModule } from '@cars/cars.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceRecord, ServiceItem]),
    CarsModule
  ],
  controllers: [ServiceRecordController],
  providers: [ServiceRecordService],
})
export class ServiceRecordModule {}
