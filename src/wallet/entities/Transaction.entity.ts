import { v4 as uuidv4 } from 'uuid';
import { Entity, Property, PrimaryKey, Enum } from '@mikro-orm/core';

export enum Type {
  WALLET_RECHARGE = 'wallet_recharge',
  WALLET_TRANSFER = 'wallet_transfer',
  BILL_PAYMENT = 'bill_payment',
  LEDGER_DEBIT = 'ledger_debit',
}

export enum Status {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity()
export class Transaction {

  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Enum({ items: () => Type, array: true })
  types: Type[] = [Type.WALLET_TRANSFER];

  @Property()
  fromAccountId: string;

  @Property()
  toAccountId?: string;

  @Property()
  amount: number;

  @Property()
  fees: number;

  @Property({ type: 'text' })
  description: string;

  @Property({ type: 'date', onCreate: ()=> new Date() })
  timestamp: Date;

  @Enum({ items: ()=> Status, array: true })
  status: Status[] = [Status.PENDING];
}