import { Migration } from '@mikro-orm/migrations';

export class Migration20250606202459 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "wallet_owner" ("id" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "phone_number" varchar(255) not null, "date_of_birth" varchar(255) not null, constraint "wallet_owner_pkey" primary key ("id"));`);
    this.addSql(`alter table "wallet_owner" add constraint "wallet_owner_phone_number_unique" unique ("phone_number");`);

    this.addSql(`create table "wallet" ("id" varchar(255) not null, "owner_id" varchar(255) not null, "balance" int not null default 0, "created_at" timestamptz not null, "last_activity" timestamptz not null, constraint "wallet_pkey" primary key ("id"));`);

    this.addSql(`alter table "wallet" add constraint "wallet_owner_id_foreign" foreign key ("owner_id") references "wallet_owner" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "wallet" drop constraint "wallet_owner_id_foreign";`);

    this.addSql(`drop table if exists "wallet_owner" cascade;`);

    this.addSql(`drop table if exists "wallet" cascade;`);
  }

}
