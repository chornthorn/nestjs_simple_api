import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const _entity = this.categoryRepository.create({ ...createCategoryDto });
    const result = await this.categoryRepository.save(_entity);
    if (!result) {
      throw new BadRequestException('Category not created');
    }
    return result;
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const _entity = this.categoryRepository.create({ ...updateCategoryDto });
    const result = await this.categoryRepository.save({
      ...category,
      ..._entity,
    });
    if (!result) {
      throw new BadRequestException('Category not updated');
    }
    return result;
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const result = await this.categoryRepository.remove(category);
    return 'Category removed';
  }
}
