from logging import Logger
from itertools import cycle
from stellar_sdk import Keypair, scval
from stellar_sdk.contract import ContractClient
from stellar_sdk import SorobanServer
from stellar_sdk.soroban_rpc import GetTransactionStatus, SendTransactionStatus
from stellar_sdk.exceptions import PrepareTransactionException
from time import sleep


def new_game(
    source_keypair: Keypair,
    contract_id: str,
    params: list,
    soroban: SorobanServer,
    logger: Logger,
):
    logger.warning("=" * 30 + "new_game".upper() + "=" * 30)

    try:
        # Criar cliente do contrato
        client = ContractClient(
            contract_id=contract_id,
            rpc_url=soroban.server_url,
            network_passphrase=soroban.get_network().passphrase,
        )

        # Invocar função new_game (com envio da transação)
        assembled_tx = client.invoke(
            function_name="new_game",
            parameters=params,
            source=source_keypair.public_key,
            signer=source_keypair,
        )

        # Assinar e enviar a transação
        logger.info("📡 Enviando transação...")
        result = assembled_tx.sign_and_submit()

        logger.info("✅ Transação enviada com sucesso")

        # Verificar se há resposta de transação disponível
        if (hasattr(assembled_tx, "get_transaction_response") and assembled_tx.get_transaction_response):
            tx_hash = assembled_tx.get_transaction_response.transaction_hash
            logger.info(f"🔗 Hash da transação: {tx_hash}")
            logger.info("🔗 https://stellar.expert/explorer/testnet/tx/" + tx_hash)

        return result

    except Exception as e:
        logger.error(f"🚨 Erro ao escrever no contrato: {e}")
        raise
