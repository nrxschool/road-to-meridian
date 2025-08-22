import logging
from stellar_sdk import (
    Keypair, 
    Server, 
    TransactionBuilder, 
    Network,
    scval,
    Address
)
from stellar_sdk.exceptions import NotFoundError, BadRequestError
from stellar_sdk.soroban import SorobanServer
from stellar_sdk.soroban.soroban_rpc import GetTransactionStatus

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configuração da rede Testnet
TESTNET_URL = "https://horizon-testnet.stellar.org"
SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org"
NETWORK_PASSPHRASE = Network.TESTNET_NETWORK_PASSPHRASE

def initialize_tap_game(source_keypair: Keypair, contract_address: str, memo: str = None):
    """
    Inicializa o contrato tap_game
    
    Args:
        source_keypair (Keypair): Keypair da conta que irá inicializar o contrato
        contract_address (str): Endereço do contrato tap_game
        memo (str): Memo opcional para a transação
        
    Returns:
        dict: Resultado da inicialização
    """
    try:
        server = Server(TESTNET_URL)
        soroban_server = SorobanServer(SOROBAN_RPC_URL)
        
        logger.info(f"🚀 Inicializando contrato tap_game")
        logger.info(f"📤 Invoker: {source_keypair.public_key}")
        logger.info(f"📋 Contract: {contract_address}")
        if memo:
            logger.info(f"🔖 Memo: {memo}")
        
        # Carregar conta fonte
        source_account = server.load_account(source_keypair.public_key)
        logger.info(f"✅ Conta fonte carregada - Sequence: {source_account.sequence}")
        
        # Construir transação de inicialização
        transaction_builder = TransactionBuilder(
            source_account=source_account,
            network_passphrase=NETWORK_PASSPHRASE,
            base_fee=100
        )
        
        if memo:
            transaction_builder = transaction_builder.add_text_memo(memo)
        
        # Adicionar operação de invocação para initialize
        transaction_builder = transaction_builder.append_invoke_contract_op(
            contract_address=contract_address,
            function_name="initialize",
            function_args=[]  # initialize não recebe argumentos além do env
        )
        
        transaction = transaction_builder.set_timeout(30).build()
        
        logger.info(f"📝 Transação de inicialização construída")
        
        # Simular transação primeiro
        simulate_response = soroban_server.simulate_transaction(transaction)
        
        if simulate_response.error:
            logger.error(f"❌ Erro na simulação: {simulate_response.error}")
            return {
                "success": False,
                "error": simulate_response.error,
                "transaction_hash": None
            }
        
        logger.info(f"✅ Simulação bem-sucedida")
        
        # Preparar e assinar transação
        prepared_transaction = soroban_server.prepare_transaction(transaction)
        prepared_transaction.sign(source_keypair)
        
        # Enviar transação
        send_response = soroban_server.send_transaction(prepared_transaction)
        
        if send_response.error_result_xdr:
            logger.error(f"❌ Erro no envio: {send_response.error_result_xdr}")
            return {
                "success": False,
                "error": send_response.error_result_xdr,
                "transaction_hash": None
            }
        
        transaction_hash = send_response.hash
        logger.info(f"📤 Transação enviada - Hash: {transaction_hash}")
        
        # Aguardar confirmação
        logger.info(f"⏳ Aguardando confirmação...")
        
        import time
        max_attempts = 30
        for attempt in range(max_attempts):
            try:
                get_response = soroban_server.get_transaction(transaction_hash)
                
                if get_response.status == GetTransactionStatus.SUCCESS:
                    logger.info(f"✅ Contrato inicializado com sucesso!")
                    return {
                        "success": True,
                        "error": None,
                        "transaction_hash": transaction_hash,
                        "status": "SUCCESS"
                    }
                elif get_response.status == GetTransactionStatus.FAILED:
                    logger.error(f"❌ Transação falhou")
                    return {
                        "success": False,
                        "error": "Transaction failed",
                        "transaction_hash": transaction_hash,
                        "status": "FAILED"
                    }
                
                time.sleep(2)
                
            except Exception as e:
                if attempt < max_attempts - 1:
                    time.sleep(2)
                    continue
                else:
                    raise e
        
        logger.warning(f"⚠️ Timeout aguardando confirmação")
        return {
            "success": False,
            "error": "Timeout waiting for confirmation",
            "transaction_hash": transaction_hash,
            "status": "TIMEOUT"
        }
        
    except NotFoundError as e:
        logger.error(f"❌ Conta não encontrada: {e}")
        return {
            "success": False,
            "error": f"Conta não encontrada: {e}",
            "transaction_hash": None
        }
    except BadRequestError as e:
        logger.error(f"❌ Erro na requisição: {e}")
        return {
            "success": False,
            "error": f"Erro na requisição: {e}",
            "transaction_hash": None
        }
    except Exception as e:
        logger.error(f"❌ Erro inesperado: {e}")
        return {
            "success": False,
            "error": f"Erro inesperado: {e}",
            "transaction_hash": None
        }

def create_new_game(source_keypair: Keypair, contract_address: str, 
                   player_address: str, nickname: str, score: int, game_time: int, memo: str = None):
    """
    Cria um novo jogo no contrato tap_game
    
    Args:
        source_keypair (Keypair): Keypair da conta que irá criar o jogo
        contract_address (str): Endereço do contrato tap_game
        player_address (str): Endereço do jogador
        nickname (str): Nickname do jogador
        score (int): Score obtido no jogo
        game_time (int): Tempo de jogo em segundos
        memo (str): Memo opcional para a transação
        
    Returns:
        dict: Resultado da criação do jogo
    """
    try:
        server = Server(TESTNET_URL)
        soroban_server = SorobanServer(SOROBAN_RPC_URL)
        
        logger.info(f"🎮 Criando novo jogo no tap_game")
        logger.info(f"📤 Invoker: {source_keypair.public_key}")
        logger.info(f"📋 Contract: {contract_address}")
        logger.info(f"👤 Player: {player_address}")
        logger.info(f"🏷️ Nickname: {nickname}")
        logger.info(f"🎯 Score: {score}")
        logger.info(f"⏱️ Game Time: {game_time}s")
        if memo:
            logger.info(f"🔖 Memo: {memo}")
        
        # Carregar conta fonte
        source_account = server.load_account(source_keypair.public_key)
        logger.info(f"✅ Conta fonte carregada - Sequence: {source_account.sequence}")
        
        # Preparar argumentos da função new_game
        function_args = [
            Address(player_address).to_xdr_sc_val(),  # player: Address
            scval.to_string(nickname),                # nickname: String
            scval.to_int64(score),                   # score: i32
            scval.to_int64(game_time)                # game_time: i32
        ]
        
        logger.info(f"🔄 Argumentos convertidos para SCVal")
        
        # Construir transação
        transaction_builder = TransactionBuilder(
            source_account=source_account,
            network_passphrase=NETWORK_PASSPHRASE,
            base_fee=100
        )
        
        if memo:
            transaction_builder = transaction_builder.add_text_memo(memo)
        
        # Adicionar operação de invocação para new_game
        transaction_builder = transaction_builder.append_invoke_contract_op(
            contract_address=contract_address,
            function_name="new_game",
            function_args=function_args
        )
        
        transaction = transaction_builder.set_timeout(30).build()
        
        logger.info(f"📝 Transação de novo jogo construída")
        
        # Simular transação primeiro
        simulate_response = soroban_server.simulate_transaction(transaction)
        
        if simulate_response.error:
            logger.error(f"❌ Erro na simulação: {simulate_response.error}")
            return {
                "success": False,
                "error": simulate_response.error,
                "transaction_hash": None
            }
        
        logger.info(f"✅ Simulação bem-sucedida")
        
        # Preparar e assinar transação
        prepared_transaction = soroban_server.prepare_transaction(transaction)
        prepared_transaction.sign(source_keypair)
        
        # Enviar transação
        send_response = soroban_server.send_transaction(prepared_transaction)
        
        if send_response.error_result_xdr:
            logger.error(f"❌ Erro no envio: {send_response.error_result_xdr}")
            return {
                "success": False,
                "error": send_response.error_result_xdr,
                "transaction_hash": None
            }
        
        transaction_hash = send_response.hash
        logger.info(f"📤 Transação enviada - Hash: {transaction_hash}")
        
        # Aguardar confirmação
        logger.info(f"⏳ Aguardando confirmação...")
        
        import time
        max_attempts = 30
        for attempt in range(max_attempts):
            try:
                get_response = soroban_server.get_transaction(transaction_hash)
                
                if get_response.status == GetTransactionStatus.SUCCESS:
                    logger.info(f"✅ Novo jogo criado com sucesso!")
                    return {
                        "success": True,
                        "error": None,
                        "transaction_hash": transaction_hash,
                        "status": "SUCCESS",
                        "game_data": {
                            "player": player_address,
                            "nickname": nickname,
                            "score": score,
                            "game_time": game_time
                        }
                    }
                elif get_response.status == GetTransactionStatus.FAILED:
                    logger.error(f"❌ Transação falhou")
                    return {
                        "success": False,
                        "error": "Transaction failed",
                        "transaction_hash": transaction_hash,
                        "status": "FAILED"
                    }
                
                time.sleep(2)
                
            except Exception as e:
                if attempt < max_attempts - 1:
                    time.sleep(2)
                    continue
                else:
                    raise e
        
        logger.warning(f"⚠️ Timeout aguardando confirmação")
        return {
            "success": False,
            "error": "Timeout waiting for confirmation",
            "transaction_hash": transaction_hash,
            "status": "TIMEOUT"
        }
        
    except NotFoundError as e:
        logger.error(f"❌ Conta não encontrada: {e}")
        return {
            "success": False,
            "error": f"Conta não encontrada: {e}",
            "transaction_hash": None
        }
    except BadRequestError as e:
        logger.error(f"❌ Erro na requisição: {e}")
        return {
            "success": False,
            "error": f"Erro na requisição: {e}",
            "transaction_hash": None
        }
    except Exception as e:
        logger.error(f"❌ Erro inesperado: {e}")
        return {
            "success": False,
            "error": f"Erro inesperado: {e}",
            "transaction_hash": None
        }

if __name__ == "__main__":
    # Teste das funções de escrita
    logger.info("🧪 Testando funções de escrita do tap_game...")
    
    # Exemplo de uso (substitua pelos valores reais)
    contract_address = "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    
    logger.info("ℹ️ Para testar, você precisa:")
    logger.info("ℹ️ 1. Endereço real do contrato deployado")
    logger.info("ℹ️ 2. Keypair com fundos suficientes")
    logger.info("ℹ️ 3. Endereço do jogador válido")
    logger.info("")
    logger.info("ℹ️ Exemplo de uso:")
    logger.info(f"ℹ️ initialize_tap_game(keypair, '{contract_address}')")
    logger.info(f"ℹ️ create_new_game(keypair, '{contract_address}', player_addr, 'nickname', 100, 30)")