import { ConfigService } from "@nestjs/config"
import { TypeOrmModuleOptions } from "@nestjs/typeorm"

export const getTypeOrmConfig = async (configService: ConfigService) : Promise<TypeOrmModuleOptions> => {
    return {
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        ssl: { rejectUnauthorized: false },
        synchronize: true,
        entities: [__dirname + '/../**/*.entity{.js,.ts}'],
    }
}