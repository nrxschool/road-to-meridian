# import lib
import logging

from wallet.create_wallet import create_keypair, fund_account, get_account_balance
from tx.create_account import create_account_operation
from tx.payment import payment_operation
from contract.read import get_rank

from stellar_sdk import Server
import coloredlogs


# setup backend
# Configure colored logging
coloredlogs.install(
    level=logging.INFO,
    fmt='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level_styles={
        'debug': {'color': 'green'},
        'info': {'color': 'blue'},
        'warning': {'color': 'yellow', 'bold': True},
        'error': {'color': 'red', 'bold': True},
        'critical': {'color': 'red', 'bold': True, 'background': 'white'}
    }
)

# Also log to file
file_handler = logging.FileHandler('stellar_demo.log')
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logging.getLogger().addHandler(file_handler)

logger = logging.getLogger(__name__)
# setup stellar sdk
TESTNET_URL = "https://horizon-testnet.stellar.org"
FRIENDBOT_URL = "https://friendbot.stellar.org"
CONTRACT_ID = "CB5MPSENBBJ264MNUTIH3G5HSGNUENWZZ6353B2OJBSQG6YMPVIZJH63"
SECRET = "SCV4NEXOJDRYDF7HYM3ZP6XAKBENVRKUJUOXIEPALUBIUGIBF6FHZR7M"
horizon_server = Server(TESTNET_URL)


# create keypair
my_wallet  = create_keypair(logger, SECRET)
# fund_account(my_wallet.public_key, horizon_server, logger)

# create another account
another_account = create_keypair(logger)
create_account_operation(my_wallet, another_account.public_key, "100", horizon_server, logger)

# # send payment from my_wallet to another_account
payment_operation(my_wallet, another_account.public_key, "777", horizon_server, logger)

# read `get_rank` from my contract
# get_rank(my_wallet, horizon_server, logger)
# write `new_game` to my contract