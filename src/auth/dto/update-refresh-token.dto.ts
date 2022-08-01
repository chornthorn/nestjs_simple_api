import { IsInt, IsString } from 'class-validator';

export class UpdateRefreshTokenDto {
  constructor(id: number, refreshToken: string) {
    this.userId = id;
    this.refreshToken = refreshToken;
  }

  @IsInt()
  userId: number;

  @IsString()
  refreshToken: string;
}
