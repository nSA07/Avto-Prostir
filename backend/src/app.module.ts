import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typrorm.config';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { CarsModule } from '@cars/cars.module';
import { ServiceRecordModule } from '@service-record/service-record.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CarsModule,
    ServiceRecordModule
  ],
})
export class AppModule {}
