import * as StellarSdk from '@stellar/stellar-sdk';
import { Player } from '@/blockchain/types/blockchain';

// Configuration using environment variables
const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT || 'https://soroban-testnet.stellar.org';
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'CCOT2GXJ2ND4FSHSG22USR2244ZJDBEBQZYEBBD3DQ45BGLYVDT3WUJB';

// Stellar Testnet configuration
const server = new StellarSdk.rpc.Server(RPC_ENDPOINT);
const networkPassphrase = StellarSdk.Networks.TESTNET;

// Contract for Soroban interaction
const contract = new StellarSdk.Contract(CONTRACT_ADDRESS);

export class SorobanService {
  /**
   * Fetches player ranking from contract
   */
  static async fetchRanking(): Promise<Player[]> {
    try {
      const sourceKeypair = StellarSdk.Keypair.random();
      const sourceAccount = new StellarSdk.Account(sourceKeypair.publicKey(), '0');

      const operation = contract.call('get_rank');
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase,
      })
        .addOperation(operation)
        .setTimeout(30)
        .build();

      const simulationResult = await server.simulateTransaction(transaction);
      
      if (StellarSdk.rpc.Api.isSimulationSuccess(simulationResult)) {
        const result = simulationResult.result;
        if (result && result.retval) {
          const rankingData = StellarSdk.scValToNative(result.retval);
          return rankingData.map((game: any, index: number) => ({
            address: `G${Math.random().toString(36).substr(2, 55).toUpperCase()}`,
            score: game.score || 0,
            rank: index + 1,
            nickname: game.nickname || 'Anonymous'
          })).sort((a, b) => b.score - a.score);
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching ranking:', error);
      return [];
    }
  }

  /**
   * Submits player score to contract
   */
  static async submitScore(
    playerAddress: string,
    nickname: string,
    score: number,
    gameTime: number,
    secretKey: string
  ): Promise<string> {
    try {
      console.log('Submitting score to Soroban contract...', {
        playerAddress,
        nickname,
        score,
        gameTime
      });

      if (!playerAddress || !nickname || score < 0 || gameTime < 0) {
        throw new Error('Invalid parameters for score submission');
      }

      const sourceKeypair = StellarSdk.Keypair.fromSecret(secretKey);
      const sourceAccount = await server.getAccount(sourceKeypair.publicKey());
      const addressScVal = new StellarSdk.Address(playerAddress).toScVal();
      const nicknameScVal = StellarSdk.nativeToScVal(nickname, { type: 'string' });
      const scoreScVal = StellarSdk.nativeToScVal(score, { type: 'i32' });
      const gameTimeScVal = StellarSdk.nativeToScVal(gameTime, { type: 'i32' });

      const operation = contract.call(
        'new_game',
        addressScVal,
        nicknameScVal,
        scoreScVal,
        gameTimeScVal
      );
      let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase,
      })
        .addOperation(operation)
        .setTimeout(30)
        .build();

      const simulationResult = await server.simulateTransaction(transaction);
      
      if (StellarSdk.rpc.Api.isSimulationSuccess(simulationResult)) {
        transaction = StellarSdk.rpc.assembleTransaction(transaction, simulationResult).build();
        transaction.sign(sourceKeypair);
        
        const result = await server.sendTransaction(transaction);
        
        if (result.status === 'PENDING') {
          let txResult;
          for (let i = 0; i < 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            txResult = await server.getTransaction(result.hash);
            if (txResult.status !== 'NOT_FOUND') {
              break;
            }
          }
          
          if (txResult && txResult.status === 'SUCCESS') {
            console.log('Score submitted successfully:', result.hash);
            return result.hash;
          }
        }
      }
      
      throw new Error('Transaction simulation failed');
      
    } catch (error) {
      console.error('Error submitting score:', error);
      throw new Error(`Failed to submit score: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Checks if contract is available
   */
  static async isContractAvailable(): Promise<boolean> {
    try {
      // Simplified check - try to simulate a read operation
      const sourceKeypair = StellarSdk.Keypair.random();
      const sourceAccount = new StellarSdk.Account(sourceKeypair.publicKey(), '0');
      
      const operation = contract.call('get_rank');
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase,
      })
        .addOperation(operation)
        .setTimeout(30)
        .build();

      await server.simulateTransaction(transaction);
      return true;
    } catch (error) {
      console.error('Error checking contract availability:', error);
      return false;
    }
  }
}

export default SorobanService;