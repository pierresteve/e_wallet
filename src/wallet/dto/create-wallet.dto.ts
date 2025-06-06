
import { IsString, IsDateString, IsNotEmpty, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @Matches(/^\+509\d{8}$/, {
    message: 'Phone number must be in the format +509XXXXXXXX',
  })
  @ApiProperty()
  phoneNumber: string;

  @IsDateString()
  @ApiProperty()
  dateOfBirth: string;

  @IsString()
  @Length(4, 4, { message: 'PIN must be a 4-digit number' })
  @ApiProperty()
  pin: string;
}