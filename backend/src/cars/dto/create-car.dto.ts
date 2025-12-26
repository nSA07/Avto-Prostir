import { IsString, IsNumber, IsOptional, Min, Max, Length, IsISO8601 } from 'class-validator';

export class CreateCarDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsString()
  plate: string;

  @IsString()
  @IsOptional()
  @Length(17, 17)
  vin?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsISO8601()
  @IsOptional()
  purchaseDate?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  purchasePrice?: number;

  @IsNumber()
  @Min(0)
  currentMileage: number;
}