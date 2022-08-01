import { Role } from '@app/common/types/role.type';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@app/database/abstract.entity';

@Entity('tbl_users')
export class User extends AbstractEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;
}
