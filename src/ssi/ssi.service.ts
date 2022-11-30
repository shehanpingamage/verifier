import { Injectable } from '@nestjs/common';
import { InitializeSsiDto } from './dto/initialize-ssi.dto';
import { RequestProofDto } from './dto/request-proof.dto';
import { SsiAgent } from './entities/ssi.entity';
import { OfferCredentialOptions } from './types/types';
import { HttpInboundTransport, agentDependencies } from '@aries-framework/node'
import { Schema } from 'indy-sdk';
import { 
    ConnectionEventTypes,
    ConnectionStateChangedEvent, 
    AriesFrameworkError,
    OutOfBandRecord, 
    DidExchangeState,
    Agent, 
    InitConfig, 
    ProofAttributeInfo,
    ProofEventTypes,
    ProofStateChangedEvent,
    AttributeFilter,
    HttpOutboundTransport, 
    WsOutboundTransport, 
    ConsoleLogger,
    LogLevel,
    InboundTransport,
    CredentialEventTypes,
    CredentialStateChangedEvent,
    CredentialExchangeRecordProps,
    V1CredentialService,
    AutoAcceptCredential
} from '@aries-framework/core'

const CANdy = `{"reqSignature":{},"txn":{"data":{"data":{"alias":"dev-bc-1","blskey":"14YvF9m4TU4FSkqZQ9gDRr9Ef95aHPuieToEPTmMNEWAqkKB75FfGM3rU25Sfhqkd8nmGMjaJDso9jWgoQdaPqQxscuxu7VcDBmkByiZWtVohk4mRxSownozaaYESpyte4A346wXfGcqxCvUUa9gSyU1qEaM6ss4Z3e5pc39hzdekAq","blskey_pop":"RXmiB6JYFKU6RJwdhfwsH9mGSJx4X8s2Dsk3gHn7Ytajsn6kuaBC6FFiRmzbKkDuYFnMzF81JuRKHC7NBrKgsh8egmyGm5APNya6W6G7XyWwGs2WHX5tUtHeBVogSQEjV8Yq4RfzbpM6TJzPDzu8HyM1Why2nX9f84DMxgxJPMJseo","client_ip":"3.99.10.96","client_port":"9702","node_ip":"3.98.254.147","node_port":"9701","services":["VALIDATOR"]},"dest":"FgRxLSbzVzcMC8ioAbzbzYi1oqhYLUsoFeDewYiw97U"},"metadata":{"from":"7iLf2c7weDopmBLyPPGLHz"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"26ac1e1cd83aa136090321bc58877f8563d1ed14cf11e78e1eb46a33692580f1"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"dev-qc-1","blskey":"NFLKzusQk9RfCAvmw5z56eFXVDhQahAwd8KoxNU4kaikT9RTUBTx537oswApMmTwFhcsrfTpwUm49QLHcVMNY4oZMyoq1ok1jZnUKvkPjqFkYahCr8VefsknaUj6qWiqoqFB1hLCdP3jeXvZbDVQSBnjTSysUkgnVwXEXdmAjt2ovn","blskey_pop":"QtrKM3pBvf9UnNgihnpoC86kVSm1VkLSj6maz9FGupZXcYcsjPaU8fbibUboW6NwzT9WfKpwCTmebDfPC6dieNZpgwxee8WDXHF7nBsgH8ctY2P3aezsEDs2zYSiCvrbdFkxBKvjNMkesK3xKUwGVUMyggjGckVFG2zZgUQ8pY4LKy","client_ip":"3.96.89.59","client_port":"9702","node_ip":"3.97.25.250","node_port":"9701","services":["VALIDATOR"]},"dest":"CfTG6ZPJzXRu9xozL43jzsA8EQXRvkbDHvYw3QzuTQrf"},"metadata":{"from":"XdVFchbXSMC898NjWCymXD"},"type":"0"},"txnMetadata":{"seqNo":2,"txnId":"8a6f8e43b9d9f7020c824e069a521b6682a91d48b3dd31bd71b67caaaf7ada9c"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"CandyDevOntNode01","blskey":"2Ldaj4ZeYmri7sx9YVGk5x1DRD5NMwbuASQPvEicqC7yQxreCvZYKKrnfi2kiTm26Mss5dm6UUeVFYLPKFwHqXWUnACyMNnHAUBw2HissHNXtLWUVXmPSdAXNgjYVTpPDZ4FuHKWuyDKtghfcb7F6UZSiJwkbVytA4aWoQmFeVrsHSp","blskey_pop":"RGkwsaPoSrERaFTbkLx5CQ8EcthFrNU8LaXsVV4dage4Cqk6eFtqeUj6BRzUaGUAQMFWiRTmfand6AhAt9ghBK6Hi2axf93JEkDChgPUC1Nks9HscMYRxs2AFuXiectW1uHEFW4QtrtWuKyfmBSfyv9rDvJiKCZsiVWaQpecUftdeP","client_ip":"20.200.95.22","client_port":"9702","node_ip":"20.151.226.136","node_port":"9701","services":["VALIDATOR"]},"dest":"DcvgAW7Wuw2aDxakjJGxFnssaXoAgUEWBhRUfNoEeVHx"},"metadata":{"from":"SmQ4y56g72C3ESKVgJTsBL"},"type":"0"},"txnMetadata":{"seqNo":3,"txnId":"3e0f572aa2a2e1c4ebf2ba679438f30f73abce817f3b6af1308c6fcb52823594"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"CandyDevOntNode02","blskey":"y9Vim7vZ39VkaacrmTcpQ8ytniabf2NSq3RRNAmELx8U93nKN1XhQaAhLJWPBwAjDtWfTP9PeaJUJZ1JNx1b3vmroZzEiPigMViZGBgnSLSiPnNyGCo1WqmSV2XD5QVqFLoRkym7C97vg9p5xTZm2EmBfdDpEc3M5F2tqofDhzFAzi","blskey_pop":"RQrbDZ1uj6QwUqGwzN2LMNw4DvpNmpgsZEYWYVM7e3aWnyiVWijgTV6mp1rjJR83x48P7dN2JYXFer8iTym9iiKvKTKKEMGEGvEUkGE3r3Mxg6hGMKEFkr5aYZMpoqiZ5BWjN52pGjMx2SfEr7FcmcHrwFw8znQvNxn8s1qh9TLCJ3","client_ip":"20.200.77.108","client_port":"9702","node_ip":"20.104.69.119","node_port":"9701","services":["VALIDATOR"]},"dest":"6Ey8JA9YDPzEccbi4dGTaEoPtWK6bvVki6WveWHMUjHb"},"metadata":{"from":"5KwZGBgmVhjAUmc3Ur8wGZ"},"type":"0"},"txnMetadata":{"seqNo":4,"txnId":"5fcd2367ffe5f0f2e63c5807692b0895f3d9db8c10a35a1974f9f507a3f291e3"},"ver":"1"}`



@Injectable()
export class SsiService {
    private setupConnectionListener(ssi_agent: SsiAgent) {
        console.log("Listen for Connections")
        ssi_agent.agent.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {
        if (payload.connectionRecord.state === DidExchangeState.Completed) {
          // the connection is now ready for usage in other protocols!
          console.log("Connection completed", payload.connectionRecord)
          ssi_agent.connection_id=payload.connectionRecord.id
          //process.exit(0)

          // *** Write Custom business logic here.
        }
        else {
          console.log("Connection status", payload.connectionRecord)
        }
      })
    }

    private setupProofRequestListener(ssi_agent: SsiAgent) {
        console.log("Listen for proof")
        ssi_agent.agent.events.on(ProofEventTypes.ProofStateChanged, async ({ payload }: ProofStateChangedEvent) => {
            console.log("Proof sate", payload.proofRecord?.state)
            console.log("Proof presentation=",payload.proofRecord?.presentationMessage?.presentationAttachments )
        })
    }

    private setupCredentialListener(ssi_agent: SsiAgent) {
      console.log("Listen for Credential Events")
      ssi_agent.agent.events.on(CredentialEventTypes.CredentialStateChanged, async ({ payload }: CredentialStateChangedEvent) => {
        const record = payload.credentialRecord
      })
    }

    getHere(): String {
        return "AFJ Test Module";
    }

    /** request a proof based on a credential definition id */
    async requestProof(ssiAgent: SsiAgent, requestProofDto: RequestProofDto): Promise<String> {
        const connectionRecord = ssiAgent.connection_id
        const proofAttribute = {
         name: new ProofAttributeInfo({
          name: 'name',
          restrictions: [
            new AttributeFilter({
              credentialDefinitionId: requestProofDto.credDefId,
            }),
          ],
         }),
        }
        console.log("*** Request Proof:", connectionRecord, proofAttribute)
        await ssiAgent.agent.proofs.requestProof(ssiAgent.connection_id, {
          requestedAttributes: proofAttribute,
        })
        var result = "Initialized"
        return result;
    }

    /** offer a credential */
    async offerCredential(ssiAgent: SsiAgent){

      const options: OfferCredentialOptions = {
        protocolVersion: 'v1',
        autoAcceptCredential: AutoAcceptCredential.Always,
        connectionId: ssiAgent.connection_id,
        comment:'Digital Health Credential',
        credentialFormats: {
          indy: {
            credentialDefinitionId: 'AyQRVus2yDuiWWkzLDjGPA:3:CL: 26932: Health Card',
            attributes: [
            {
              name: 'HCN',
              value: '1002492864'
            },
            { name: 'VC',
              value: 'BB'
            },
            { name: 'DOB',
              value: '07/06/1972'
            }
          ]
          }
        }
      }
      const credential = await ssiAgent.agent.credentials.offerCredential(options)
      console.log("offered credential",credential.toJSON )

      return credential.toJSON()
    } 

     /** out of band enables you to create an invite that can be used to set up the inital connection/send a proof request, and also option to reuse an existing connection */
    async createOutOfBandInvitation(ssiAgent: SsiAgent): Promise<Object> {

        var outOfBandRecord = await ssiAgent.agent.oob.createInvitation()
        var invite = {
            invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({ domain: 'http://'+ssiAgent.endpoint+':'+ssiAgent.inPort }),
            outOfBandRecord
        }
        console.log(" OOB invitation : ", invite.invitationUrl)
        return invite
    }

    /** out of band invite but using a legacy version of it, for agents that cant support oob.createInvitation() */
    async createLegacyInvitation(ssiAgent: SsiAgent): Promise<Object> {
      const { invitation } = await ssiAgent.agent.oob.createLegacyInvitation()
      var legacyInvitation = invitation.toUrl({ domain: 'http://'+ssiAgent.endpoint+':'+ssiAgent.inPort  })
      console.log(" Legacy invitation :", legacyInvitation)
      return legacyInvitation
    }

    private async getGenesisTransaction(url: string) {
      const response = await fetch(url)
      return await response.text()
    }

    async initializeAgent(initSsi: InitializeSsiDto, ssiAgent: SsiAgent): Promise<String> {
        ssiAgent.ledger_url = 'http://test.bcovrin.vonx.io/genesis'
        const config: InitConfig = {
            label: 'docs-nodejs-agent',
            logger: new ConsoleLogger(LogLevel.info),
            walletConfig: {
                id: 'wallet-id',
                key: 'testkey0000000000000000000000000',
            },
	          publicDidSeed: 'shehissuerdidseed000000000000001',
            indyLedgers: [
              {
                genesisTransactions: await this.getGenesisTransaction(ssiAgent.ledger_url) /*CANdy*/,
                id: 'greenlights',
                isProduction: false,
              },
            ],            
            autoAcceptConnections: true,
            endpoints: ['http://'+initSsi.endpoint+':'+initSsi.inPort]
        }
        // Creating an agent instance
        const agent = new Agent(config, agentDependencies)
        // Registering the required in- and outbound transports
        agent.registerOutboundTransport(new HttpOutboundTransport())
        agent.registerInboundTransport(new HttpInboundTransport({ port: initSsi.inPort }))
        // Function to initialize the agent
        const initialize = async () => await agent.initialize().catch(console.error)

        await agent.initialize()

        ssiAgent.agent = agent
        ssiAgent.inPort = initSsi.inPort
        ssiAgent.endpoint = initSsi.endpoint
        console.log("New agent = ", initSsi)
        var result = "Initialized"

        this.setupConnectionListener(ssiAgent)
        this.setupProofRequestListener(ssiAgent)
        this.setupCredentialListener(ssiAgent)

        return result;
    }

    getInPort(ssiAgent: SsiAgent): number {
        console.log("port is:", ssiAgent.inPort)
        return ssiAgent.inPort;
    }

    async registerSchemaAndCredentialDefintion(ssiAgent: SsiAgent): Promise<void> {
      try{
        const schema = await ssiAgent.agent.ledger.registerSchema({ name: 'DHC', version: '1.0', attributes: ['HCN', 'VC', 'DOB'] })
        //await ssiAgent.agent.ledger.registerCredentialDefinition({ schema, supportRevocation: false, tag: 'default' })
      } catch (error) {
        if (error instanceof AriesFrameworkError) {
          if (error.message.includes('UnauthorizedClientRequest')) {
            console.log("unauthorized client : " + error)
          }
        }
        console.log("something went wrong:" + error)
      }
    }
     
    

}
