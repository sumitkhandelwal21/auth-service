import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { randomUUID } from "crypto";

@Entity()
export class User {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ type: "varchar", nullable: true, unique: true })
  phone: string | null = null;

  @Column({ type: "varchar", nullable: true })
  avatar: string | null = null;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: "varchar", default: "user" })
  role!: string;

  @Column({ type: "varchar", nullable: true, default: null })
  refreshToken: string | null = null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  setId() {
    if (!this.id) {
      this.id = randomUUID();
    }
  }
}
