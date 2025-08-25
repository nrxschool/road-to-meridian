from logging import Logger
from itertools import cycle
from stellar_sdk import Keypair, Network, SorobanServer, TransactionBuilder, xdr
from stellar_sdk.soroban_rpc import GetTransactionStatus, SendTransactionStatus
from stellar_sdk.exceptions import PrepareTransactionException
from time import sleep


def decode_error_result_xdr(error_result_xdr: str, logger: Logger):
    try:
        transaction_result = xdr.TransactionResult.from_xdr(error_result_xdr)
        error_code = transaction_result.result.code

        error_messages = {
            -1: "txFAILED: Transação falhou",
            -2: "txTOO_EARLY: Transação muito cedo",
            -3: "txTOO_LATE: Transação muito tarde",
            -4: "txMISSING_OPERATION: Operação ausente",
            -5: "txBAD_SEQ: Número de sequência inválido",
            -6: "txBAD_AUTH: Assinatura inválida",
            -7: "txINSUFFICIENT_BALANCE: Saldo insuficiente",
            -8: "txNO_ACCOUNT: Conta não existe",
            -9: "txINSUFFICIENT_FEE: Taxa insuficiente",
            -10: "txBAD_AUTH_EXTRA: Assinatura extra inválida",
            -11: "txINTERNAL_ERROR: Erro interno",
            -12: "txNOT_SUPPORTED: Não suportado",
            -13: "txFEE_BUMP_INNER_FAILED: Fee bump inner falhou",
            -14: "txBAD_SPONSORSHIP: Sponsorship inválido",
            -15: "txBAD_MIN_SEQ_AGE_OR_GAP: Min seq age ou gap inválido",
            -16: "txMALFORMED: Transação malformada",
            -17: "txSOROBAN_INVALID: Soroban inválido",
        }

        error_msg = error_messages.get(error_code, f"Erro desconhecido: {error_code}")
        logger.error(f"🔍 Código do erro: {error_code}")
        logger.error(f"📝 Descrição: {error_msg}")

        return error_code, error_msg

    except Exception as e:
        logger.error(f"❌ Erro ao decodificar XDR: {e}")
        return None, None


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
        logger.error(
            f"🚨 Erro antes de enviar a transação\n{'👇' * 30}\n{e.simulate_transaction_response.error}"
        )
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


def new_game(
    source_keypair: Keypair,
    contract_id: str,
    params: list,
    soroban: SorobanServer,
    logger: Logger,
):
    logger.warning("=" * 30 + "new_game".upper() + "=" * 30)
    invoke_function(source_keypair, contract_id, "new_game", params, soroban, logger)
