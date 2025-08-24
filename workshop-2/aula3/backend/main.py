# import lib
import logging

from wallet.create_wallet import create_keypair, fund_account, get_account_balance
from tx.create_account import create_account_operation
from tx.payment import payment_operation
from contract.read import get_rank

from stellar_sdk import Server


# setup backend
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('stellar_demo.log')
    ]
)
logger = logging.getLogger(__name__)

# setup stellar sdk
TESTNET_URL = "https://horizon-testnet.stellar.org"
FRIENDBOT_URL = "https://friendbot.stellar.org"
CONTRACT_ID = "CB5MPSENBBJ264MNUTIH3G5HSGNUENWZZ6353B2OJBSQG6YMPVIZJH63"
horizon_server = Server(TESTNET_URL)


# create keypair
my_wallet  = create_keypair(logger)
# fund_account(my_wallet.public_key, logger)
get_account_balance(my_wallet.public_key, horizon_server, logger)

# # create another account
# another_account = Keypair.random()
# logger.info("New Wallet")
# logger.info(another_account)
# create_account_operation(my_wallet, another_account.public_key, "100", horizon_server, logger)

# # send payment from my_wallet to another_account
# payment_operation(my_wallet, another_account.public_key, "777", horizon_server, logger)

# read `get_rank` from my contract
get_rank(my_wallet, horizon_server, logger)
# write `new_game` to my contract