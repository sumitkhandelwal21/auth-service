import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntity1763909139709 implements MigrationInterface {
    name = 'UpdateUserEntity1763909139709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_6620cd026ee2b231beac7cfe57" ON "user" ("role") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_6620cd026ee2b231beac7cfe57"`);
    }

}
