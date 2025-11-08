export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponseDto extends AuthTokensDto {
  message: string;
  user: UserResponseDto;
}

export interface LoginResponseDto extends AuthTokensDto {
  message: string;
  user: UserResponseDto;
}