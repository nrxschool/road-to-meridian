import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDK2HVUG7226QJFO5JL6S2WWB5V4UNQ3VUPKLKKQ6GWWFCZW7Y3ZAZNJ",
  }
} as const


export interface Game {
  game_time: i32;
  nickname: string;
  player: string;
  score: i32;
}

export type DataKey = {tag: "Rank", values: void} | {tag: "PlayerAddress", values: readonly [string]};

export interface Client {
  /**
   * Construct and simulate a new_game transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  new_game: ({player, nickname, score, game_time}: {player: string, nickname: string, score: i32, game_time: i32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_rank transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_rank: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Game>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAAIbmV3X2dhbWUAAAAEAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAAAAAAACG5pY2tuYW1lAAAAEAAAAAAAAAAFc2NvcmUAAAAAAAAFAAAAAAAAAAlnYW1lX3RpbWUAAAAAAAAFAAAAAA==",
        "AAAAAAAAAAAAAAAIZ2V0X3JhbmsAAAAAAAAAAQAAA+oAAAfQAAAABEdhbWU=",
        "AAAAAQAAAAAAAAAAAAAABEdhbWUAAAAEAAAAAAAAAAlnYW1lX3RpbWUAAAAAAAAFAAAAAAAAAAhuaWNrbmFtZQAAABAAAAAAAAAABnBsYXllcgAAAAAAEwAAAAAAAAAFc2NvcmUAAAAAAAAF",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAABFJhbmsAAAABAAAAAAAAAA1QbGF5ZXJBZGRyZXNzAAAAAAAAAQAAABM=" ]),
      options
    )
  }
  public readonly fromJSON = {
    new_game: this.txFromJSON<null>,
        get_rank: this.txFromJSON<Array<Game>>
  }
}