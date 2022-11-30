import type {
  AutoAcceptCredential,
  AutoAcceptProof,
  CredentialFormatPayload,
  HandshakeProtocol,
  IndyCredentialFormat,
  PresentationPreviewAttributeOptions,
  PresentationPreviewPredicateOptions,
  ProofAttributeInfo,
  ProofPredicateInfo,
  ProofRecord,
  ProofRequestConfig,
  ProtocolVersionType,
  ReceiveOutOfBandInvitationConfig,
  V1CredentialService,
  V2CredentialService,
} from '@aries-framework/core'

type CredentialFormats = [IndyCredentialFormat]
type CredentialServices = [V1CredentialService, V2CredentialService]

export interface OfferCredentialOptions {
  protocolVersion: ProtocolVersionType<CredentialServices>
  credentialFormats: {
    indy: {
      credentialDefinitionId: string
      attributes: {
        name: string
        value: string
      }[]
    }
  }
  autoAcceptCredential?: AutoAcceptCredential
  comment?: string
  connectionId: string
}

