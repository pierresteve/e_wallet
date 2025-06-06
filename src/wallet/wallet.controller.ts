import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import chalk from 'chalk';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {
  }

  //Creation d un wallet
  @Post()
  async create(@Body() createWalletDto: CreateWalletDto) {
    this.validateCreateWalletDto(createWalletDto);

    const wallet = await this.walletService.createWallet(createWalletDto);
    return {
      success: true,
      wallet: {
        id: wallet.id,
        balance: wallet.balance,
        owner: {
          firstName: wallet.owner.firstName,
          lastName: wallet.owner.lastName,
          phoneNumber: wallet.owner.phoneNumber,
        },
      },
    };
  }

  private validateCreateWalletDto(createWalletDto: CreateWalletDto) {
    // 1. Prénom et nom non vides
    if (!createWalletDto.firstName || !createWalletDto.lastName) {
      throw new BadRequestException('Firstname and lastName are required');
    }

    // 2. Numéro de téléphone valide (format +509XXXXXXXX)
    const phoneRegex = /^\+509\d{8}$/;
    if (!phoneRegex.test(createWalletDto.phoneNumber)) {
      throw new BadRequestException('Phone number must be in the format +509XXXXXXXX');
    }

    // 3. L'utilisateur doit avoir au moins 16 ans
    const age = this.calculateAge(createWalletDto.dateOfBirth);
    if (age < 16) {
      throw new BadRequestException('User must be at least 16 years old');
    }

    // 4. Le PIN doit contenir exactement 4 chiffres
    if (!/^\d{4}$/.test(createWalletDto.pin)) {
      throw new BadRequestException('PIN must be a 4-digit number');
    }
  }

  // Calculer l'âge à partir de la date de naissance
  private calculateAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;

  }


  //consulter le profile d un wallets
  // @Get(':phoneNumber/profile')
  // async getWalletsProfil(@Param('phoneNumber') phoneNumber: string) {
  //   const phoneRegex = /^\+509\d{8}$/;
  //   //verifier si phone est de type +(509)40000000
  //   if (!phoneRegex.test(phoneNumber)) {
  //     throw new BadRequestException('Phone number must be a valid phone number');
  //   }
  //   const profile_wallet = await this.walletService.findWalletProfil(phoneNumber.toString());
  //
  //
  // }

  // //consulter le solde d'un wallet
  // @Get(':phoneNumber/balance')
  // getWalletSolde(@Param('phoneNumber') phoneNumber: string) {
  //   return this.walletService.findWalletSolde(phoneNumber.toString());
  // }

  //transfert entre wallet
  // @Post('/transfer')
  // doTransferBetweenWallet(@Body() createWalletDto: CreateWalletDto) {
  //   return this.walletService.transfertBetweenWallet(createWalletDto);
  // }

  //historique des transaction d'un wallet
  // @Get(':phoneNumber/transactions')
  // getWalletHistory(
  //   @Param('phoneNumber') phoneNumber: string,
  //   @Query('limit') limit: number,) {
  //   return this.walletService.walletHistory(phoneNumber.toString());
  // }

  //Statut du Ledger
  // @Get('admin/ledger/status')
  // getLedgerStatus() {
  //   return this.walletService.ledgerStatus();
  // }

  //Historique du Ledger
  // @Get('/admin/ledger/transactions')
  // getLedgerHistory(
  //   @Query('limit') limit: number
  // ) {
  //   return this.walletService.ledgerHistory();
  // }
}