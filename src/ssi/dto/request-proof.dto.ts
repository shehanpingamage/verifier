import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestProofDto {
  @IsString()
  @ApiProperty({example: "AyQRVus2yDuiWWkzLDjGPA:3:CL: 26932: Driving Licence"})
  readonly credDefId: string;

}