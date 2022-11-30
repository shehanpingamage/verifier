import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvitationDto {
  @IsString()
  @ApiProperty({example: "https://didcomm.org/out-of-band/1.0/invitation"})
  readonly handshakeProtocols: string;

}