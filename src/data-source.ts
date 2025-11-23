import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST ?? "localhost",
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  username: process.env.POSTGRES_USER ?? "postgres",
  password: process.env.POSTGRES_PASSWORD ?? "postgres",
  database: process.env.POSTGRES_DB ?? "auth-db",
  synchronize: false,
  logging: false,
  migrationsRun: false,
  entities: [isProduction ? "dist/entity/**/*.js" : "src/entity/**/*.ts"],
  migrations: [isProduction ? "dist/migration/**/*.js" : "src/migration/**/*.ts"],
  subscribers: [isProduction ? "dist/subscriber/**/*.js" : "src/subscriber/**/*.ts"],
});
