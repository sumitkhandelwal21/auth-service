import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitUserTable1731670200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          { name: "id", type: "uuid", isPrimary: true, isNullable: false },
          { name: "email", type: "varchar", isNullable: false, isUnique: true },
          { name: "password", type: "varchar", isNullable: false },
          { name: "firstName", type: "varchar", isNullable: false },
          { name: "lastName", type: "varchar", isNullable: false },
          { name: "phone", type: "varchar", isNullable: true, isUnique: true },
          { name: "avatar", type: "varchar", isNullable: true },
          {
            name: "isActive",
            type: "boolean",
            isNullable: false,
            default: true,
          },
          {
            name: "role",
            type: "enum",
            enumName: "user_role_enum",
            enum: ["user", "admin"],
            isNullable: false,
            default: "'user'",
          },
          {
            name: "refreshToken",
            type: "varchar",
            isNullable: true,
            default: null,
          },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user");
    await queryRunner.query('DROP TYPE IF EXISTS "user_role_enum"');
  }
}
