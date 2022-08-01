import { AbstractEntity } from "@app/database/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity('tbl_categories')
export class Category extends AbstractEntity {


    @Column({
        type: "varchar",
        length: 100,
    })
    name: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: true,
    })
    description: string;
}
