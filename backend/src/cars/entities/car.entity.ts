import { ServiceRecord } from '@service-record/entities/service-record.entity';
import { User } from '@user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';


@Entity('cars')
export class Car {
    @PrimaryGeneratedColumn("uuid", { name: "car_id" })
    id: string

    @Column()
    name: string;

    @Column({ type: 'int' })
    year: number;

    @Column({ nullable: true })
    plate: string;

    @Column({ length: 17, nullable: true })
    vin: string;

    @Column({ nullable: true })
    country: string;

    @Column({ type: 'date', nullable: true })
    purchaseDate: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    purchasePrice: number;

    @Column({ type: 'int' })
    currentMileage: number;

    @OneToMany(() => ServiceRecord, (record) => record.car, { onDelete: 'CASCADE' })
    serviceRecords: ServiceRecord[];

    @ManyToOne(() => User, (user) => user.cars, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    userId: string;

    @CreateDateColumn({ name: "create_at" })
    createAt: Date;

    @UpdateDateColumn({ name: "update_at" })
    updateAt: Date;
}