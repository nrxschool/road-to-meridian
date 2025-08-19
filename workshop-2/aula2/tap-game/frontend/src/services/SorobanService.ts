import * as StellarSdk from '@stellar/stellar-sdk';
import { Player } from '@/blockchain/types/blockchain';

// Configuração usando variáveis de ambiente
const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT || 'https://soroban-testnet.stellar.org';
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'CCOT2GXJ2ND4FSHSG22USR2244ZJDBEBQZYEBBD3DQ45BGLYVDT3WUJB';

// Configuração da rede Stellar Testnet
const server = new StellarSdk.rpc.Server(RPC_ENDPOINT);
const networkPassphrase = StellarSdk.Networks.TESTNET;

// Contrato para interação com Soroban
const contract = new StellarSdk.Contract(CONTRACT_ADDRESS);

export class SorobanService {
  /**
   * Busca o ranking de jogadores do contrato
   */
  static async fetchRanking(): Promise<Player[]> {
    try {
      console.log('Fetching ranking from Soroban contract...');
      
      // Criar uma conta temporária para fazer a chamada (read-only)
      const sourceKeypair = StellarSdk.Keypair.random();
      const sourceAccount = await server.getAccount(sourceKeypair.publicKey()).catch(() => {
        // Se a conta não existe, criar uma conta mock para simulação
        return new StellarSdk.Account(sourceKeypair.publicKey(), '0');
      });

      // Construir a operação de chamada do contrato
      const operation = contract.call('get_rank');
      
      // Construir a transação
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase,
      })
        .addOperation(operation)
        .setTimeout(30)
        .build();

      // Simular a transação para obter o resultado
      const simulationResult = await server.simulateTransaction(transaction);
      
      if (StellarSdk.rpc.Api.isSimulationSuccess(simulationResult)) {
        // Processar o resultado da simulação
        const result = simulationResult.result;
        if (result && result.retval) {
          // Converter o resultado XDR para dados JavaScript
          const rankingData = StellarSdk.scValToNative(result.retval);
          
          // Mapear os dados para o formato Player
          const players: Player[] = rankingData.map((game: any, index: number) => ({
            address: `G${Math.random().toString(36).substr(2, 55).toUpperCase()}`, // Endereço simulado
            score: game.score || 0,
            rank: index + 1,
            nickname: game.nickname || 'Anônimo'
          }));
          
          // Ordenar por score (maior para menor)
          return players.sort((a, b) => b.score - a.score);
        }
      }
      
      // Fallback: retornar dados vazios se não conseguir buscar do contrato
      console.warn('Could not fetch ranking from contract, returning empty array');
      return [];
      
    } catch (error) {
      console.error('Error fetching ranking:', error);
      
      // Fallback: retornar dados de exemplo em caso de erro
      console.warn('Using fallback ranking data due to error');
      return [];
    }
  }

  /**
   * Envia o score do jogador para o contrato
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

      // Validar parâmetros
      if (!playerAddress || !nickname || score < 0 || gameTime < 0) {
        throw new Error('Invalid parameters for score submission');
      }

      // Criar keypair do jogador
      const sourceKeypair = StellarSdk.Keypair.fromSecret(secretKey);
      const sourceAccount = await server.getAccount(sourceKeypair.publicKey());

      // Converter parâmetros para ScVal
      const addressScVal = new StellarSdk.Address(playerAddress).toScVal();
      const nicknameScVal = StellarSdk.nativeToScVal(nickname, { type: 'string' });
      const scoreScVal = StellarSdk.nativeToScVal(score, { type: 'i32' });
      const gameTimeScVal = StellarSdk.nativeToScVal(gameTime, { type: 'i32' });

      // Construir a operação de chamada do contrato
      const operation = contract.call(
        'new_game',
        addressScVal,
        nicknameScVal,
        scoreScVal,
        gameTimeScVal
      );
      
      // Construir a transação
      let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase,
      })
        .addOperation(operation)
        .setTimeout(30)
        .build();

      // Simular a transação primeiro
      const simulationResult = await server.simulateTransaction(transaction);
      
      if (StellarSdk.rpc.Api.isSimulationSuccess(simulationResult)) {
        // Preparar a transação com os dados da simulação
        transaction = StellarSdk.rpc.assembleTransaction(transaction, simulationResult).build();
        
        // Assinar a transação
        transaction.sign(sourceKeypair);
        
        // Enviar a transação
        const result = await server.sendTransaction(transaction);
        
        if (result.status === 'PENDING') {
          // Aguardar confirmação
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
   * Verifica se o contrato está disponível
   */
  static async isContractAvailable(): Promise<boolean> {
    try {
      // Verificação simplificada - tentar fazer uma simulação de leitura
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