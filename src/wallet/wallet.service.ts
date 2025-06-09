import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { LedgerAccount } from './entities/LedgerAccount.entity';
import { Status, Transaction, Type } from './entities/Transaction.entity';
import { WalletOwner } from './entities/wallet-owner.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';
import { Type as TransactionType } from './entities/Transaction.entity'
import { Status as status } from './entities/Transaction.entity'



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
      dto.nationalId
    );

    const wallet = new Wallet(owner, dto.pin);

    // Persist les deux entités avec EntityManager
    this.em.persist(owner);
    this.em.persist(wallet);

    // Flush une seule fois
    await this.em.flush();

    return wallet;
  }

  //Recharger un wallet a partir du compte Ledger
  async rechargeWallet(dto: RechargeWalletDto) {
    //verifier si le numero telephone existe
    const find_phone = await this.em.findOne(WalletOwner,{ phoneNumber: dto.phoneNumber });
    if (find_phone === null ){
      throw new ConflictException('A wallet not found');
    }

    //calculer les frais dumontant net
    const feeRate = 0.02;
    const fees = +(dto.amount * feeRate).toFixed(2);
    const montant_net = +(dto.amount - fees).toFixed(2);

    //recuperation du compte ledger
    const ledger = await this.em.findOne(LedgerAccount,{ id: 'LEDGER_MASTER' });

    if (!ledger) {
      throw new ConflictException('Ledger account not found');
    }
    //si montant insuffi
    if (ledger.balance < dto.amount ){
      throw new ConflictException('Fonds insuffisants dans le compte Ledger');
    }
    //sinon retrait
    ledger.balance -= dto.amount;

    //trouver le wallet avec le numero de tlf
    const wallet_a_recharger = await this.em.findOne(Wallet, { owner: find_phone.id })
    if(!wallet_a_recharger){
      throw new ConflictException('A wallet not found');
    }
    //sil jwenn li
    wallet_a_recharger.balance += montant_net;


      const transaction = new Transaction();
      transaction.types = [TransactionType.WALLET_RECHARGE];
      transaction.fromAccountId = 'LEDGER_MASTER';
      transaction.toAccountId = find_phone.id;
      transaction.amount = dto.amount;
      transaction.fees = fees;
      transaction.description =  'Recharge depuis le compte Ledger';
      transaction.status = [Status.PENDING];


      await this.em.persistAndFlush([ledger, transaction, wallet_a_recharger]);

      console.log(transaction);

    return {
      success: true,
      data: {
        walletTransaction: {
          id: transaction.id,
          type: transaction.types,
          amount: transaction.amount,
          metadata: {
            ownerName: `${find_phone.firstName} ${find_phone.lastName}`,
          },
          ledgerTransaction: {
            id: ledger.id,
            balance: ledger.balance,
          },
        },
        newBalance: wallet_a_recharger.balance,
        ledgerBalance: ledger.balance,
      },
    };

  }
}
