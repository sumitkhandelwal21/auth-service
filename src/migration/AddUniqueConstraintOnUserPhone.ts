import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueConstraintOnUserPhone1731670100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user" ADD CONSTRAINT "UQ_user_phone" UNIQUE ("phone")'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user" DROP CONSTRAINT "UQ_user_phone"'
    );
  }
}