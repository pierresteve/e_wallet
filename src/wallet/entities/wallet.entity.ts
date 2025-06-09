import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { WalletOwner } from './wallet-owner.entity';

@Entity()
export class Wallet {
  @PrimaryKey()
  id: string = `WALLET_${uuidv4()}`; // plus lisible pour un ID de wallet

  @ManyToOne(() => WalletOwner)
  owner!: WalletOwner; // relation vers les infos personnelles

  @Property()
  balance: number = 0;

   @Property()
   pin!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  lastActivity: Date = new Date();

  constructor(owner: WalletOwner, pin: string) {
    this.owner = owner;
    this.pin = pin;
  }
}
