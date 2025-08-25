from stellar_sdk import Keypair, Server, TransactionBuilder, Payment, Asset, Network
from stellar_sdk.exceptions import NotFoundError, BadRequestError
from logging import Logger

def payment_operation(source_keypair: Keypair, destination_public_key: str, amount: str, server: Server, logger: Logger):
    logger.warning("=" * 30 + "payment_operation".upper() + "=" * 30)
    logger.info("💸 Iniciando pagamento XLM")
    logger.info(f"📤 From: {source_keypair.public_key}")
    logger.info(f"📥 To: {destination_public_key}")
    logger.info(f"💰 Amount: {amount} XLM")
       
    try:
        source_account = server.load_account(source_keypair.public_key)
        # Construir transação
        transaction = (TransactionBuilder(
                source_account=source_account,
                network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
                base_fee=100
            )
            .append_payment_op(
                destination=destination_public_key,
                asset=Asset.native(),
                amount=amount
            )
            .set_timeout(30)
            .build()
        )
        logger.info(f"📝 Transação construída")
        
        # Assinar transação
        transaction.sign(source_keypair)
        logger.info(f"✍️ Transação assinada")
        
        # Submeter transação
        logger.info(f"📡 Submetendo transação...")
        response = server.submit_transaction(transaction)
        logger.info(f"✅ Transação submetida com sucesso")
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
