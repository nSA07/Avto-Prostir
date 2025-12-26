import { Car } from '@cars/entities/car.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ServiceItem } from './service-item.entity';

@Entity('service_records')
export class ServiceRecord {
    @PrimaryGeneratedColumn("uuid", { name: "service_record_id" })
    id: string

    @Column({ type: 'int' })
    mileage: number;

    @Column({ type: 'date' })
    date: Date;

    @ManyToOne(() => Car, (car) => car.serviceRecords, { onDelete: 'CASCADE' })
    car: Car;

    @OneToMany(() => ServiceItem, (item) => item.serviceRecord, { cascade: true })
    items: ServiceItem[];

    @CreateDateColumn({ name: "create_at" })
    createAt: Date;

    @UpdateDateColumn({ name: "update_at" })
    updateAt: Date;
}