import { AbstractEntity } from "@app/database/abstract.entity";
import { Column, Entity } from "typeorm";


@Entity('tbl_tasks')
export class Task extends AbstractEntity {

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'boolean', default: false })
    is_completed: boolean;

    @Column({ type: 'int', nullable: false })
    user_id: number;


}