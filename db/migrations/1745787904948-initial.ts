import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1745787904948 implements MigrationInterface {
    name = 'Initial1745787904948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_usertype_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(255), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "userType" "public"."users_usertype_enum" NOT NULL DEFAULT 'user', "isVerified" boolean NOT NULL DEFAULT false, "verificationToken" character varying, "profileImage" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "comment" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" integer, "productId" integer, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "stock" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" integer, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_a6b3c434392f5d10ec171043666" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_99d90c2a483d79f3b627fb1d5e9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_99d90c2a483d79f3b627fb1d5e9"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_a6b3c434392f5d10ec171043666"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_usertype_enum"`);
    }

}
