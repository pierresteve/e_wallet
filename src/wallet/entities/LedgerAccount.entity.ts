import { Property, Entity, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class LedgerAccount{
  @PrimaryKey()
  id: string;

  @Property()
  name:string;

  @Property()
  balance: number;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}