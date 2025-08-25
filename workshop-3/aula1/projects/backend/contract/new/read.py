import json
from stellar_sdk import Keypair, scval
from stellar_sdk.contract import ContractClient
from stellar_sdk import SorobanServer
from logging import Logger
from stellar_sdk.exceptions import PrepareTransactionException


def get_rank(
    source_keypair: Keypair, contract_id: str, soroban: SorobanServer, logger: Logger
):
    logger.warning("=" * 30 + "get_rank".upper() + "=" * 30)

    try:
        # Criar cliente do contrato
        client = ContractClient(
            contract_id=contract_id,
            rpc_url=soroban.server_url,
            network_passphrase=soroban.get_network().passphrase,
        )

        # Invocar função get_rank (apenas simulação para leitura)
        assembled_tx = client.invoke(
            function_name="get_rank",
            parameters=[],
            source=source_keypair.public_key,
            signer=source_keypair,
            parse_result_xdr_fn=lambda xdr_result: scval.to_native(xdr_result),
            simulate=True,
        )

        # Obter resultado da simulação
        result = assembled_tx.result()

        if result is not None:
            logger.info(f"✅ Resultado:\n{result}")
        else:
            logger.error("❌ Função retornou None")

        return result

    except Exception as e:
        logger.error(f"🚨 Erro ao ler contrato: {e}")
        raise
