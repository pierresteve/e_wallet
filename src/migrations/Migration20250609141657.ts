import { Migration } from '@mikro-orm/migrations';

export class Migration20250609141657 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "ledger_account" ("id" varchar(255) not null, "name" varchar(255) not null, "balance" int not null, "created_at" timestamptz not null, constraint "ledger_account_pkey" primary key ("id"));`);

    this.addSql(`create table "transaction" ("id" uuid not null, "types" text[] not null, "from_account_id" varchar(255) not null, "to_account_id" varchar(255) not null, "amount" int not null, "fees" int not null, "description" text not null, "timestamp" date not null, "status" text[] not null, constraint "transaction_pkey" primary key ("id"));`);

    this.addSql(`alter table "wallet" add column "pin" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "ledger_account" cascade;`);

    this.addSql(`drop table if exists "transaction" cascade;`);

    this.addSql(`alter table "wallet" drop column "pin";`);
  }

}
