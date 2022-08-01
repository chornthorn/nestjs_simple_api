import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('tbl_products')
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    image: string;

    @Column()
    category: string;
}
