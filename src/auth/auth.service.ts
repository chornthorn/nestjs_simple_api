import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@app/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateTokenDto } from '@app/auth/dto/create-token.dto';
import { AuthTokenDto } from '@app/auth/dto/auth-token.dto';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { User } from '@app/users/entities/user.entity';
import { UpdateRefreshTokenDto } from '@app/auth/dto/update-refresh-token.dto';
import { LoginDto } from '@app/auth/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: CreateUserDto): Promise<AuthTokenDto> {
    registerDto.password = await this.hashData(registerDto.password);
    const user = await this.usersService.create(registerDto);
    return await this._generateToken(user);
  }

  async login(loginDto: LoginDto): Promise<AuthTokenDto> {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) throw new BadRequestException('Invalid email or password.');

    const comparePassword = await this.compareEncrypt(
      loginDto.password,
      user.password,
    );
    if (!comparePassword) {
      throw new BadRequestException('Invalid email or password.');
    }
    return await this._generateToken(user);
  }

  async refreshToken(
    email: string,
    refreshToken: string,
  ): Promise<AuthTokenDto> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new ForbiddenException('Access denied.');

    if (user.refreshToken == null)
      throw new UnauthorizedException('The refresh token is invalid.');

    const refreshTokenMatches = await this.compareEncrypt(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    return await this._generateToken(user);
  }

  async _generateToken(user: User) {
    const accessAndRefresh = new CreateTokenDto(user.id, user.email, user.role);
    const generate = await this.generateToken(accessAndRefresh);
    const updateRefreshDto = new UpdateRefreshTokenDto(
      user.id,
      generate.refreshToken,
    );
    const updateRefreshToken = await this.updateUserRefreshToken(
      updateRefreshDto,
    );
    if (!updateRefreshToken) {
      throw new BadRequestException('Generate token not successfully');
    }
    return generate;
  }

  async updateUserRefreshToken(
    updateToken: UpdateRefreshTokenDto,
  ): Promise<boolean> {
    const refresh_token = await this.hashData(updateToken.refreshToken);
    const userUpdate = await this.usersService.updateRefreshToken(
      updateToken.userId,
      refresh_token,
    );
    if (!userUpdate) {
      throw new BadRequestException('Get new access token not successfully');
    }
    return userUpdate;
  }

  async logout() {
    return 'Logout successfully!';
  }

  public async generateToken(
    createToken: CreateTokenDto,
  ): Promise<AuthTokenDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId: createToken.userId,
          email: createToken.email,
          roles: createToken.roles,
        },
        {
          secret: 'access-token-secret',
          expiresIn: 60 * 60 * 24 * 7, // 15 minutes
        },
      ),
      this.jwtService.signAsync(
        {
          userId: createToken.userId,
          email: createToken.email,
          roles: createToken.roles,
        },
        {
          secret: 'refresh-token-secret',
          expiresIn: 60 * 60 * 24 * 7, //  1 week
        },
      ),
    ]);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  public async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  public async compareEncrypt(text: string, encryptText: string) {
    return await bcrypt.compare(text, encryptText);
  }
}
