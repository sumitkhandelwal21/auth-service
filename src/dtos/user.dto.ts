import { UserResponseDto } from "./auth.dto";

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export type UserProfileDto = UserResponseDto;
