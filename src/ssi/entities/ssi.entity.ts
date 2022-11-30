import { Agent } from '@aries-framework/core'

export class SsiAgent {
  /**
   * AFJ SSI Agent
   * @example SSI
   */
  agent: Agent;

  endpoint: string

  inPort: number;

  connection_id: string

  ledger_url: string
}