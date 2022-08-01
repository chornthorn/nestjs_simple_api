import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '@app/users/dto/update-user.dto';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '@app/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginateDto,
  PaginateMetaDto,
  PaginateOptionsDto,
} from '@app/common/paginations/PaginateDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const _entity = this.usersRepository.create({ ...createUserDto });
    return await this.usersRepository.save(_entity);
  }

  async findAll(
    pageOptionsDto: PaginateOptionsDto,
  ): Promise<PaginateDto<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder
      .orderBy('user.create_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const paginateMetaDto = new PaginateMetaDto({ pageOptionsDto, itemCount });
    return new PaginateDto<User>(entities, paginateMetaDto);
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateResult = await this.usersRepository.update(
      { id },
      { ...updateUserDto },
    );
    if (!updateResult) {
      throw new BadRequestException("Can't Update user");
    }
    return {
      data: 'Update user successfully',
    };
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.usersRepository.update(
      { id: userId },
      { refreshToken },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return true;
  }

  async userProfile(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found.');
    delete user.password;
    return user;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    const result = await this.usersRepository.remove(user);
    if (!result) {
      throw new BadRequestException('User delete not successfully');
    }
    return {
      data: 'User delete successfully',
    };
  }
}
