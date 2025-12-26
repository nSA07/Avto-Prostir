
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ServiceRecord } from "./service-record.entity";

@Entity('service_items')
export class ServiceItem {
    @PrimaryGeneratedColumn("uuid", { name: "service_item_id" })
    id: string

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => ServiceRecord, (record) => record.items, { onDelete: 'CASCADE' })
    serviceRecord: ServiceRecord;

    @CreateDateColumn({ name: "create_at" })
    createAt: Date;

    @UpdateDateColumn({ name: "update_at" })
    updateAt: Date;
}