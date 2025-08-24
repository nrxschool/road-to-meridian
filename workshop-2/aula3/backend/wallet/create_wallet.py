import requests
from logging import Logger
from stellar_sdk import Server, Keypair
from stellar_sdk.exceptions import NotFoundError


def create_keypair(logger: Logger):
    keypair = Keypair.from_secret("SCHCUXNQEFS3LBBEGHGQLSTQ3WLIEEXIEYUY3MGJAYZUCO5YIQKGV4LX")
    logger.info(f"✅ Keypair criado com sucesso")
    logger.info(f"📍 Public Key: {keypair.public_key}")
    logger.info(f"🔐 Secret Key: {keypair.secret}")
    return keypair


def fund_account(public_key: str, logger: Logger):
    url = "https://friendbot.stellar.org"
    try:
        response = requests.get(url, params={"addr": public_key})
        response.raise_for_status()
        logger.info(f"✅ Conta funded com sucesso!")
    except requests.RequestException as e:
        logger.error(f"❌ Erro ao fundir conta: {e}")

def get_account_balance(public_key: str, server: Server, logger: Logger):
    try:
        logger.info(f"🔍 Consultando saldo da conta: {public_key}")
        
        account = server.accounts().account_id(public_key).call()
        
        logger.info(f"✅ Conta encontrada")
        logger.info(f"📊 Sequence: {account['sequence']}")
        
        for balance in account['balances']:
            asset_type = balance['asset_type']
            if asset_type == 'native':
                logger.info(f"💎 XLM Balance: {balance['balance']}")
            else:
                asset_code = balance.get('asset_code', 'Unknown')
                logger.info(f"🪙 {asset_code} Balance: {balance['balance']}")
        
        return account
        
    except NotFoundError:
        logger.warning(f"⚠️ Conta não encontrada: {public_key}")
        return None
    except Exception as e:
        logger.error(f"❌ Erro ao consultar conta: {e}")
        return None
