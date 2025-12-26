
import { Car } from "@cars/entities/car.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid", { name: "user_id" })
    id: string

    @Column()
    email: string

    @Column()
    password: string

    @OneToMany(() => Car, (car) => car.user)
    cars: Car[];

    @CreateDateColumn({ name: "create_at" })
    createAt: Date;

    @UpdateDateColumn({ name: "update_at" })
    updateAt: Date;
}
