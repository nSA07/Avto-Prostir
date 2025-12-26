import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ServiceRecordService } from './service-record.service';
import { CreateServiceRecordDto } from './dto/create-service-record.dto';
import { UpdateServiceRecordDto } from './dto/update-service-record.dto';

@Controller('service-record')
export class ServiceRecordController {
  constructor(private readonly serviceRecordService: ServiceRecordService) {}

  @Post('cars/:carId')
  async create(
    @Param('carId', ParseUUIDPipe) carId: string,
    @Body() createDto: CreateServiceRecordDto, 
  ) {
    return this.serviceRecordService.create(carId, createDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceRecordService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceRecordDto: UpdateServiceRecordDto) {
    return this.serviceRecordService.update(id, updateServiceRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceRecordService.remove(id);
  }
}
