import time

from stellar_sdk import xdr as stellar_xdr
from stellar_sdk import Keypair, Server, Network, TransactionBuilder, scval
from stellar_sdk.soroban_rpc import SimulateTransactionRequest
from stellar_sdk import SorobanServer
from stellar_sdk.exceptions import NotFoundError, BadRequestError
from logging import Logger

# Network.TESTNET_NETWORK_PASSPHRASE

# def get_game_rank(contract_address: str, logger: Logger, soroban: Server):
#     try:
#         logger.info(f"📊 Consultando ranking do tap_game")
#         logger.info(f"📋 Contract: {contract_address}")
        
#         # Simular chamada de leitura para get_rank
#         from stellar_sdk import TransactionBuilder, scval
#         from stellar_sdk.soroban.soroban_rpc import SimulateTransactionRequest
        
#         # Criar uma conta temporária para simulação
#         temp_keypair = Keypair.random()
#         server = Server(TESTNET_URL)
        
#         # Construir transação de simulação
#         source_account = server.load_account(temp_keypair.public_key)
        
#         transaction_builder = TransactionBuilder(
#             source_account=source_account,
#             network_passphrase=NETWORK_PASSPHRASE,
#             base_fee=100
#         )
        
#         # Adicionar operação de invocação para get_rank
#         transaction_builder = transaction_builder.append_invoke_contract_op(
#             contract_address=contract_address,
#             function_name="get_rank",
#             function_args=[]
#         )
        
#         transaction = transaction_builder.set_timeout(30).build()
        
#         # Simular transação
#         simulate_request = SimulateTransactionRequest(transaction=transaction)
#         simulate_response = soroban_server.simulate_transaction(simulate_request)
        
#         if simulate_response.error:
#             logger.error(f"❌ Erro na simulação: {simulate_response.error}")
#             return {
#                 "success": False,
#                 "error": simulate_response.error,
#                 "data": None
#             }
        
#         # Extrair resultado
#         result_xdr = simulate_response.result
#         if result_xdr and result_xdr.auth:
#             logger.info("✅ Ranking obtido com sucesso")
#             return {
#                 "success": True,
#                 "error": None,
#                 "data": result_xdr,
#                 "ranking": "Dados do ranking em XDR"
#             }
        
#         logger.info("✅ Consulta realizada (sem dados)")
#         return {
#             "success": True,
#             "error": None,
#             "data": None,
#             "ranking": []
#         }
        
#     except NotFoundError as e:
#         logger.error(f"❌ Contrato não encontrado: {e}")
#         return {
#             "success": False,
#             "error": f"Contrato não encontrado: {e}",
#             "data": None
#         }
#     except BadRequestError as e:
#         logger.error(f"❌ Erro na requisição: {e}")
#         return {
#             "success": False,
#             "error": f"Erro na requisição: {e}",
#             "data": None
#         }
#     except Exception as e:
#         logger.error(f"❌ Erro inesperado: {e}")
#         return {
#             "success": False,
#             "error": f"Erro inesperado: {e}",
#             "data": None
#         }

# def get_player_score(contract_address: str, player_address: str):
#     """
#     Obtém o score de um jogador específico
    
#     Args:
#         contract_address (str): Endereço do contrato tap_game
#         player_address (str): Endereço do jogador
        
#     Returns:
#         dict: Resultado da consulta com o score do jogador
#     """
#     try:
#         logger.info(f"🎯 Consultando score do jogador")
#         logger.info(f"📋 Contract: {contract_address}")
#         logger.info(f"👤 Player: {player_address}")
        
#         # Implementação similar ao get_game_rank, mas consultando storage específico
#         # Por enquanto, retornamos uma estrutura de exemplo
#         logger.info("ℹ️ Função de consulta de score individual em desenvolvimento")
#         logger.info("💡 Use get_game_rank() e filtre pelo player_address")
        
#         return {
#             "success": True,
#             "error": None,
#             "player_address": player_address,
#             "score": None,
#             "message": "Use get_game_rank() para obter todos os scores"
#         }
        
#     except Exception as e:
#         logger.error(f"❌ Erro ao consultar score: {e}")
#         return {
#             "success": False,
#             "error": f"Erro ao consultar score: {e}",
#             "data": None
#         }

# def check_contract_initialized(contract_address: str):

#     """
#     Verifica se o contrato foi inicializado
    
#     Args:
#         contract_address (str): Endereço do contrato tap_game
        
#     Returns:
#         dict: Resultado da verificação
#     """
#     try:
#         logger.info(f"🔍 Verificando inicialização do contrato")
#         logger.info(f"📋 Contract: {contract_address}")
        
#         # Tentar obter o ranking - se existir, o contrato foi inicializado
#         rank_result = get_game_rank(contract_address)
        
#         if rank_result["success"]:
#             logger.info("✅ Contrato inicializado")
#             return {
#                 "success": True,
#                 "initialized": True,
#                 "error": None
#             }
#         else:
#             logger.warning("⚠️ Contrato pode não estar inicializado")
#             return {
#                 "success": True,
#                 "initialized": False,
#                 "error": rank_result["error"]
#             }
            
#     except Exception as e:
#         logger.error(f"❌ Erro ao verificar inicialização: {e}")
#         return {
#             "success": False,
#             "initialized": False,
#             "error": f"Erro ao verificar inicialização: {e}"
#         }




#     # Teste das funções de leitura
#     logger.info("🧪 Testando funções de leitura do tap_game...")
    
#     # Exemplo de uso (substitua pelo endereço real do contrato)
#     contract_address = "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    
#     logger.info("ℹ️ Para testar, substitua contract_address pelo endereço real")
#     logger.info("ℹ️ Exemplo de uso:")
#     logger.info(f"ℹ️ get_game_rank('{contract_address}')")
#     logger.info(f"ℹ️ check_contract_initialized('{contract_address}')")
    
    


def get_rank(source_keypair: Keypair, server: Server, logger: Logger):
    soroban_server = SorobanServer(server_url="https://soroban-testnet.stellar.org")

    try:
        source_account = server.load_account(source_keypair.public_key)
        logger.info(source_account)
        transaction = (
            TransactionBuilder(
                source_account=source_account,
                network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
                base_fee=100
            )
            .add_text_memo("Lendo o rank do contrato")
            .append_invoke_contract_function_op(
                contract_id="CABITINKEZYQCK5APN7RC57WAVIVI64OAG3LDZRRWYYNY3XI2QU37NG5",
                function_name="new_game",
                parameters=[scval.to_address("GDGPAMHWX2DVTSUBE54GJOH7NB5TYRCEQWAOLJIZP2R2NYHZHIUL7IRR"), scval.to_string("Lucas"), scval.to_int32(89), scval.to_int32(10)]
            )
            # .append_invoke_contract_function_op(
            #     contract_id="CABITINKEZYQCK5APN7RC57WAVIVI64OAG3LDZRRWYYNY3XI2QU37NG5",
            #     function_name="get_rank",
            #     parameters=[]
            # )
            .set_timeout(30)
            .build()
        )

        tx = soroban_server.prepare_transaction(transaction)

        tx.sign(source_keypair)
        response = soroban_server.send_transaction(tx)
        # response = server.submit_transaction(tx)
        tx_hash = response.hash
        logger.info("🔗 https://stellar.expert/explorer/testnet/tx/" + tx_hash)
        
        
        time.sleep(2)
        get_transaction_data = soroban_server.get_transaction(tx_hash)
        
        transaction_meta = stellar_xdr.TransactionMeta.from_xdr(
            get_transaction_data.result_meta_xdr
        )
        result = transaction_meta.v3.soroban_meta.return_value

        print(f"🎁 Resultado: {scval.to_native(result)}")
        
        # simulate_request = SimulateTransactionRequest(transaction=transaction)
        # print(simulate_request)
        
    except Exception as e:
        logger.error(e)