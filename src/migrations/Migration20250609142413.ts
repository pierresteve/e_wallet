import { Migration } from '@mikro-orm/migrations';

export class Migration20250609142413 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "wallet_owner" add column "national_id" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "wallet_owner" drop column "national_id";`);
  }

}
