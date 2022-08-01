import { IsEmail, IsInt } from 'class-validator';
import { Role } from '@app/common/types/role.type';

export class CreateTokenDto {
  constructor(id: number, email: string, roles: Role) {
    this.userId = id;
    this.email = email;
    this.roles = roles;
  }

  @IsInt()
  readonly userId: number;

  @IsEmail()
  readonly email: string;

  roles: Role;
}
