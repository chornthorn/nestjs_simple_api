import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from '@app/auth/auth.module';
import { UsersModule } from '@app/users/users.module';
import { CommonModule } from '@app/common/common.module';
import { DatabaseModule } from '@app/database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@app/auth/guards/roles.guard';
import { AccessGuard } from '@app/auth/guards/access.guard';
import { TaskModule } from './task/task.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    CommonModule,
    AuthModule,
    UsersModule,
    TaskModule,
    CategoryModule,
    ProductModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
