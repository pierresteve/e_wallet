import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Wallet } from './entities/wallet.entity';
import { WalletOwner } from './entities/wallet-owner.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Wallet, WalletOwner]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
