import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitializeSsiDto {
  @IsInt()
  @ApiProperty({example: 8000})
  readonly inPort: number;

  @IsString()
  @ApiProperty({example: "afj-test.veridid.services"})
  readonly endpoint: string;

}