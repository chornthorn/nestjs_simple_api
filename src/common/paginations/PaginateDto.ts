import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginateDto<T> {
  @IsString()
  message: string;

  @IsArray()
  readonly data: T[];

  readonly meta: PaginateMetaDto;

  constructor(data: T[], meta: PaginateMetaDto, message: string = 'success') {
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}
export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginateOptionsDto {
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}

export interface PaginateMetaDtoParameters {
  pageOptionsDto: PaginateOptionsDto;
  itemCount: number;
}

export class PaginateMetaDto {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PaginateMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
