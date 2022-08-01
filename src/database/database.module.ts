import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        namingStrategy: new SnakeNamingStrategy(),
        autoLoadEntities: configService.get<boolean>('AUTOLOADENTITIES'),
        synchronize: configService.get<boolean>('SYNCHRONIZE'),
        logging: configService.get<boolean>('DATABASE_LOGGING'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
