from time import sleep

from ..utils import decode_error_result_xdr

from logging import Logger
from itertools import cycle
from stellar_sdk import Keypair, Network, SorobanServer, TransactionBuilder
from stellar_sdk.soroban_rpc import GetTransactionStatus, SendTransactionStatus
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

    # Prepara e assina a transação
    try:
        tx = soroban.prepare_transaction(tx)
        logger.info("Transaction prepared successfully")
    except PrepareTransactionException as e:
        logger.error(f"🚨 Erro antes de enviar a transação\n{'👇' * 30}\n{e.simulate_transaction_response.error}")
        raise

    tx.sign(keypair)
    logger.info("Transaction signed successfully")

    # Envia a transação
    try:
        response = soroban.send_transaction(tx)
        logger.info("Transaction sent successfully")
    except Exception as e:
        logger.error(f"🚨 Erro ao enviar a transação: {e}")
        raise
        
    if response.status == SendTransactionStatus.ERROR:
        logger.error(f"🚨 Erro ao enviar a transação: {response}")
        if response.error_result_xdr:
            logger.error("🔍 Decodificando erro da transação:")
            decode_error_result_xdr(response.error_result_xdr, logger)
        raise Exception(f"Transaction failed with status: {response.status}")

    # Hash da transação para confirmar o status
    tx_hash = response.hash
    logger.info("🔗 https://stellar.expert/explorer/testnet/tx/" + tx_hash)
    logger.info(f"Transaction hash: {tx_hash}")

    # Animação de espera e verificação de status da transação
    clocks = cycle(["|", "/", "-", "\\", "|", "/", "-", "\\"])
    milliseconds = 0
    while True:
        milliseconds += 100
        print(
            f"\r⏰ Esperando transação confirmar {next(clocks)} ({milliseconds}ms)",
            end="",
        )
        get_transaction_data = soroban.get_transaction(tx_hash)
        if get_transaction_data.status != GetTransactionStatus.NOT_FOUND:
            logger.info(f"Transaction found after {milliseconds}ms")
            break
        sleep(0.1)  # Sleep for 100ms
    # Limpa a linha de animação após confirmação
    print("\r" + " " * 50, end="\r")

    # Verifica o status final da transação
    if get_transaction_data.status != GetTransactionStatus.SUCCESS:
        logger.error(f"🚨 Transação falhou: {get_transaction_data.result_xdr}")
    else:
        logger.info("Transaction completed successfully")



def new_game(source_keypair: Keypair, contract_id: str, params: list, soroban: SorobanServer, logger: Logger):
    logger.warning("=" * 30 + "new_game".upper() + "=" * 30)
    invoke_function(source_keypair, contract_id, "new_game", params, soroban, logger)