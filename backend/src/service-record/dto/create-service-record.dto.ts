import { Type } from 'class-transformer';
import { IsString, IsNumber, IsISO8601, IsOptional, Min, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';

class CreateServiceItemDto {
    @IsString()
    @IsNotEmpty({ message: 'Опис виконаних робіт не може бути порожнім' })
    description: string;

    @IsNumber({}, { message: 'Вартість має бути числом' })
    @IsOptional()
    @Min(0, { message: 'Вартість не може бути меншою за нуль' })
    price?: number;
}

export class CreateServiceRecordDto {
    @IsNumber({}, { message: 'Пробіг має бути числом' })
    @Min(0, { message: 'Пробіг не може бути від’ємним' })
    mileage: number;

    @IsISO8601({}, { message: 'Некоректний формат дати. Використовуйте YYYY-MM-DD' })
    date: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateServiceItemDto)
    items: CreateServiceItemDto[];
}
