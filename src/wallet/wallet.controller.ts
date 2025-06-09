import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { RechargeWalletDto} from './dto/recharge-wallet.dto';

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


  //recharger un wallet depuis le compte LedgerAccount
  @Post('/recharge')
  rechargeWallet(@Body() dto: RechargeWalletDto) {
    return this.walletService.rechargeWallet(dto);
  }



}