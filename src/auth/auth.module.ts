import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@app/users/users.module';
import { AccessTokenJwtStrategy } from '@app/auth/strategies/access-token-jwt.strategy';
import { RefreshTokenJwtStrategy } from '@app/auth/strategies/refresh-token-jwt.strategy';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenJwtStrategy, RefreshTokenJwtStrategy],
  exports: [AuthService, AccessTokenJwtStrategy, RefreshTokenJwtStrategy],
})
export class AuthModule {}
