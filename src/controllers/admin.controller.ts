import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Not } from "typeorm";

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const [users, count] = await userRepository.findAndCount({
      where: { role: Not("admin") },
      select: [
        "id",
        "email",
        "firstName",
        "lastName",
        "phone",
        "avatar",
        "role",
        "isActive",
        "createdAt",
        "updatedAt",
      ],
    });
    res.json({ message: "Users retrieved successfully", count, users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };
    if (!id) {
      return res.status(400).json({ message: "User id is required" });
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await userRepository.remove(user);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserCount = async (_req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const count = await userRepository.count({
      where: { role: Not("admin") },
    });
    res.json({ message: "User count retrieved successfully", count });
  } catch (error) {
    console.error("Get user count error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
