import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse,ApiTags } from '@nestjs/swagger';
import { SsiService } from './ssi.service';
import type { InitConfig } from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/node'
import { SsiAgent } from './entities/ssi.entity';
import { InitializeSsiDto } from './dto/initialize-ssi.dto';
import { RequestProofDto } from './dto/request-proof.dto';
import { OfferCredentialOptions } from './types/types';

@Controller('ssi')
export class SsiController {

    constructor(private readonly ssiService: SsiService) {}

    ssiAgent = new SsiAgent();
    oobRecord = null
    invitation = null

    @Get()
    @ApiResponse({
      status: 200,
      description: 'Here',
      type: String,
    })
    getHere(): String {
      return this.ssiService.getHere();
    }

    @Get('create-out-of-band-invitation')
    @ApiOperation({ summary: 'Create an out of band connection invite' })
    @ApiResponse({status: 200, description: 'Connection link',type: String })
    async createOutOfBandInvitation(): Promise<Object> {
        this.oobRecord = this.ssiService.createOutOfBandInvitation(this.ssiAgent)
        return this.oobRecord
    }

    @Get('create-legacy-invitation')
    @ApiOperation({ summary: 'Create an out of band legacy connection invite' })
    @ApiResponse({status: 200, description: 'Connection link',type: String })
    async createLegacyInvitation(): Promise<Object> {
        this.invitation = this.ssiService.createLegacyInvitation(this.ssiAgent)
        return this.invitation
    }

    @Post('request-proof')
    @ApiOperation({ summary: 'Request proof' })
    @ApiResponse({status: 200, description: 'Sending proof request',type: String })
    async requestProof(@Body() requestProofDto: RequestProofDto): Promise<String> {
        console.log("Request Proof call")
        return this.ssiService.requestProof(this.ssiAgent, requestProofDto)
    }

    @Post('initialize')
    @ApiOperation({ summary: 'Initialize Agent' })
    @ApiResponse({status: 200, description: 'Agent Created',type: String })
    async initializeAgent(@Body() initializeSsiDto: InitializeSsiDto): Promise<String> {
      return this.ssiService.initializeAgent(initializeSsiDto, this.ssiAgent)
    }

    @Post('create-schema-and-credential-definition')
    @ApiOperation({ summary: 'Create the initial Schema and Credential Definition - one time call only' })
    @ApiResponse({status: 200, description: 'Schema Created',type: String })
    async registerSchemaAndCredentialDefintion(): Promise<void> {
      this.ssiService.registerSchemaAndCredentialDefintion(this.ssiAgent)
    }

    
    @Post('offer-credential')
    @ApiOperation({ summary: 'Offer a DHC Credential to the user' })
    @ApiResponse({status: 200, description: 'Credential Offered',type: String })
    async offerCredential(@Body() options: OfferCredentialOptions){
      this.ssiService.offerCredential(this.ssiAgent)
    }
     
/*
    @Get('listen-connections')
    @ApiOperation({ summary: 'Listen for connections' })
    @ApiResponse({status: 200, description: 'Listening for connections',type: String })
    async listenConnections(): Promise<Boolean> {
        return this.ssiService.listenConnections(this.ssiAgent)
    }

    @Get('listen-proofs')
    @ApiOperation({ summary: 'Listen for proofs' })
    @ApiResponse({status: 200, description: 'Listening for proofs',type: String })
    async listenProofs(): Promise<Boolean> {
        return this.ssiService.listenProofs(this.ssiAgent)
    }
*/

    /*
    @Get('inbound-port')
    @ApiOperation({ summary: 'Get the inbound port' })
    @ApiResponse({
      status: 200,
      description: 'Inbound Port'
    })
    getInPort(): number {
      return this.ssiService.getInPort(this.ssiAgent);
    }
*/

}
