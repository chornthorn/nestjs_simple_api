import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {

  // inject the repository with the Product entity
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) { }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    const result =  await this.productRepository.save(product);
    if (!result) {
      throw new Error('Error creating product');
    }
    return result;
  }

  async findAll() {
    const products = await this.productRepository.find();
    return products;
  }


  // find one product by id
  async findOne(id: number) {
    const product = await this.productRepository.findOne({where: {id}});
    return product;
  }

  // update product
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({where: {id}});
    if (!product) {
      throw new Error('Product not found');
    }
    const updatedProduct = this.productRepository.merge(product, updateProductDto);
    const result = await this.productRepository.save(updatedProduct);
    return result;
  }

  // delete product
  async delete(id: number) {
    const product = await this.productRepository.findOne({where: {id}});
    if (!product) {
      throw new Error('Product not found');
    }
    const result = await this.productRepository.remove(product);
    return result;
  }
}
