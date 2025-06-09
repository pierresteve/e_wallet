import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class RechargeWalletDto {
  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: '+50940404040' })
  @IsNotEmpty()
  // @Matches(/^\+509\d{8}$/, {
  //   message: 'Le numéro de téléphone doit être au format +509XXXXXXXX',
  // })
  phoneNumber: string;
}