import json

from stellar_sdk import Keypair, Network, TransactionBuilder, scval
from stellar_sdk import SorobanServer
from logging import Logger
from stellar_sdk.exceptions import PrepareTransactionException


def invoke_function(
    keypair: Keypair,
    contract_id: str,
    function_name: str,
    params: list,
    soroban: SorobanServer,
    logger: Logger,
):
    logger.info(f"Starting invoke_function for {function_name}")
    logger.info(f"Contract ID: {contract_id}")
    logger.info(f"Parameters: {params}")

    sender_account = soroban.load_account(keypair.public_key)
    logger.info(f"Loaded account for {keypair.public_key}")

    tx = (
        TransactionBuilder(sender_account, Network.TESTNET_NETWORK_PASSPHRASE, 100)
        .set_timeout(300)
        .append_invoke_contract_function_op(
            contract_id=contract_id,
            function_name=function_name,
            parameters=params,
        )
        .build()
    )
    logger.info("Transaction built successfully")

    # Simula a transação apenas (sem enviar)
    try:
        simulate_response = soroban.simulate_transaction(tx)
        logger.info("Transaction simulated successfully")
    except PrepareTransactionException as e:
        logger.error(f"🚨 Erro na simulação da transação\n{'👇' * 30}\n{e.simulate_transaction_response.error}")
        raise

    # Extrai e retorna o resultado da simulação
    if simulate_response.results is None:
        logger.warning("⚠️ Simulação não retornou resultado")
        return None
    
    if len(simulate_response.results) == 0:
        logger.warning("⚠️ Função não retornou valor na simulação")
        return None
    
    return scval.to_native(simulate_response.results[0].xdr)


def get_rank(source_keypair: Keypair, contract_id: str, soroban: SorobanServer, logger: Logger):
    logger.warning("=" * 30 + "get_rank".upper() + "=" * 30)
    result = invoke_function(source_keypair, contract_id, "get_rank", [], soroban, logger)
    
    if result is not None:
        logger.info(f"✅ Resultado:\n{result}")
    else:
        logger.error("❌ Função retornou None devido a erro na transação")
    return result


