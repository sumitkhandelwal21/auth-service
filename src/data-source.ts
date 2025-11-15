import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST ?? "db",
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  username: process.env.POSTGRES_USER ?? "postgres",
  password: process.env.POSTGRES_PASSWORD ?? "postgres",
  database: process.env.POSTGRES_DB ?? "auth-db",
  synchronize: false,
  logging: false,
  migrationsRun: false,
  entities: [__dirname + "/entity/**/*.js"],
  migrations: [__dirname + "/migration/**/*.js"],
  subscribers: ["src/subscriber/**/*.ts"],
});
