import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { WalletOwner } from './entities/wallet-owner.entity';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class WalletService {
  constructor(
    private readonly em: EntityManager
  ) {}

  async createWallet(dto: CreateWalletDto) {
    const existingOwner = await this.em.findOne(WalletOwner,{ phoneNumber: dto.phoneNumber });

    if (existingOwner) {
      throw new ConflictException('A wallet already exists for this phone number');
    }

    const owner = new WalletOwner(
      dto.firstName,
      dto.lastName,
      dto.phoneNumber,
      dto.dateOfBirth,
    );

    const wallet = new Wallet(owner, dto.pin);

    // Persist les deux entités avec EntityManager
    this.em.persist(owner);
    this.em.persist(wallet);

    // Flush une seule fois
    await this.em.flush();

    return wallet;
  }

  // async transfertBetweenWallet(dto: CreateWalletDto) {
  //   // à implémenter selon ta logique métier
  //   return `Transfer between wallets (en cours)`;
  // }
  //
  // async walletHistory(phoneNumber: string) {
  //   return `wallet history for ${phoneNumber} (à implémenter)`;
  // }
  //
  // async ledgerStatus() {
  //   return `Ledger status (à implémenter)`;
  // }
  //
  // async ledgerHistory() {
  //   return `Ledger history (à implémenter)`;
  // }
}
