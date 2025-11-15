import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import * as bcrypt from "bcrypt";
import { User } from "../entity/User";
import { generateTokens } from "../utils/jwt.utils";
import { registerValidation, loginValidation } from "../utils/validation.utils";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  UserResponseDto,
} from "../dtos/auth.dto";

export const register = async (req: Request, res: Response) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) {
      const message = error.details?.[0]?.message || error.message;
      return res.status(400).json({ message });
    }

    const { email, password, firstName, lastName, phone, avatar, role } =
      req.body as RegisterDto;
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    if (phone) {
      const existingPhoneUser = await userRepository.findOne({
        where: { phone },
      });
      if (existingPhoneUser) {
        return res
          .status(409)
          .json({ message: "User with this phone already exists" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone ?? null;
    user.avatar = avatar ?? null;
    user.role = role ?? "user";

    await userRepository.save(user);

    const userResponse: UserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    if (user.phone != null) {
      userResponse.phone = user.phone;
    }
    if (user.role != null) {
      userResponse.role = user.role;
    }
    if (user.avatar != null) {
      userResponse.avatar = user.avatar;
    }

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      const message = error.details?.[0]?.message || error.message;
      return res.status(400).json({ message });
    }

    const { email, password } = req.body as LoginDto;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email,
    });

    user.refreshToken = refreshToken;
    await userRepository.save(user);

    const userResponse: UserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    if (user.phone != null) {
      userResponse.phone = user.phone;
    }
    if (user.avatar != null) {
      userResponse.avatar = user.avatar;
    }

    res.json({
      message: "Login successful",
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as RefreshTokenDto;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { refreshToken } });

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: user.id,
      email: user.email,
    });

    user.refreshToken = newRefreshToken;
    await userRepository.save(user);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (user) {
      user.refreshToken = null;
      await userRepository.save(user);
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
