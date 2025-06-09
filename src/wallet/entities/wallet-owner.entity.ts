import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/core';
import { Wallet } from './wallet.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class WalletOwner {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property({ unique: true })
  phoneNumber: string;

  @Property()
  dateOfBirth: string;

  @Property({ nullable:true})
  nationalId: string;

  @OneToMany(() => Wallet, wallet => wallet.owner)
  wallets = new Array<Wallet>();

  constructor(firstName: string, lastName: string, phoneNumber: string, dateOfBirth: string, nationalId: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.dateOfBirth = dateOfBirth;
    this.nationalId = nationalId;
  }
}
