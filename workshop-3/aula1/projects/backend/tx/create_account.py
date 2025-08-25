from stellar_sdk import Keypair, Server, TransactionBuilder, Network, Asset
from stellar_sdk.exceptions import BadRequestError
from logging import Logger

import time


def create_account_operation(source_keypair: Keypair, destination_public_key: str, starting_balance: str, server: Server, logger: Logger):
    logger.warning("=" * 30 + "create_account_operation".upper() + "=" * 30)
    logger.info(f"🏗️ Iniciando criação de conta via CreateAccount operation")
    logger.info(f"📤 Source Account: {source_keypair.public_key}")
    logger.info(f"📥 Destination Account: {destination_public_key}")
    logger.info(f"💰 Starting Balance: {starting_balance} XLM")

    try:        
        source_account = server.load_account(source_keypair.public_key)
        logger.info(f"✅ Conta fonte carregada - Sequence: {source_account.sequence}")

        transaction = (
            TransactionBuilder(
                source_account=source_account,
                network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
                base_fee=100
            )
            .add_text_memo(f"Creating account {destination_public_key[:8]}...")
            .append_create_account_op(
                destination=destination_public_key,
                starting_balance=starting_balance
            )
            .set_timeout(30)
            .build()
        )

        logger.info("📝 Transação construída")
        logger.info(f"🔖 Memo: Creating account {destination_public_key[:8]}...")
        
        # Assinar transação
        transaction.sign(source_keypair)
        logger.info("✍️ Transação assinada")
        
        # Submeter transação
        logger.info("📡 Submetendo transação...")
        response = server.submit_transaction(transaction)
        logger.info("✅ Transação submetida com sucesso")
        logger.info("🔗 https://stellar.expert/explorer/testnet/tx/" + response["hash"])
            
    except BadRequestError as e:
        logger.error(f"❌ Erro de requisição: {e}")
        logger.error(f"📄 Details: {e.extras}")
        return {
            "success": False,
            "error": "Bad request",
            "details": str(e)
        }
    except Exception as e:
        logger.error(f"❌ Erro inesperado: {e}")
        return {
            "success": False,
            "error": "Unexpected error",
            "details": str(e)
        }
