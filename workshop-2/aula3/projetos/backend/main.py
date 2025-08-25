# import lib
import logging

from wallet.create_wallet import create_keypair, fund_account, get_account_balance
from tx.create_account import create_account_operation
from tx.payment import payment_operation

from stellar_sdk import Server, SorobanServer, scval
import coloredlogs


# setup backend
# Configure colored logging
coloredlogs.install(
    level=logging.INFO,
    fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level_styles={
        "debug": {"color": "green"},
        "info": {"color": "blue"},
        "warning": {"color": "yellow", "bold": True},
        "error": {"color": "red", "bold": True},
        "critical": {"color": "red", "bold": True, "background": "white"},
    },
)

# Also log to file
file_handler = logging.FileHandler("stellar_demo.log")
file_handler.setFormatter(
    logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
)
logging.getLogger().addHandler(file_handler)

logger = logging.getLogger(__name__)

# setup stellar sdk
HORIZON_RPC_URL = "https://horizon-testnet.stellar.org"
SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org"
FRIENDBOT_URL = "https://friendbot.stellar.org"
CONTRACT_ID = "CB5MPSENBBJ264MNUTIH3G5HSGNUENWZZ6353B2OJBSQG6YMPVIZJH63"
SECRET = "SCV4NEXOJDRYDF7HYM3ZP6XAKBENVRKUJUOXIEPALUBIUGIBF6FHZR7M"

horizon_server = Server(HORIZON_RPC_URL)
soroban_server = SorobanServer(SOROBAN_RPC_URL)


# create keypair
my_wallet = create_keypair(logger, SECRET)
# fund_account(my_wallet.public_key, horizon_server, logger)

# # create another account
# another_account = create_keypair(logger)
# create_account_operation(
#     my_wallet, another_account.public_key, "100", horizon_server, logger
# )

# # send payment from my_wallet to another_account
# payment_operation(my_wallet, another_account.public_key, "777", horizon_server, logger)


## OLD WAY
from contract.old.read import get_rank as old_get_rank
from contract.old.write import new_game as old_create_new_game

# read `get_rank` from my contract
old_get_rank(my_wallet, CONTRACT_ID, soroban_server, logger)
old_create_new_game(
    my_wallet,
    CONTRACT_ID,
    [
        scval.to_address(my_wallet.public_key),
        scval.to_string("lucas000"),
        scval.to_int32(77),
        scval.to_int32(10),
    ],
    soroban_server,
    logger,
)
old_get_rank(my_wallet, CONTRACT_ID, soroban_server, logger)
# write `new_game` to my contract


## NEW WAY
from contract.new.read import get_rank as new_get_rank
from contract.new.write import new_game as new_create_new_game


# Ler ranking usando nova implementação
new_get_rank(my_wallet, CONTRACT_ID, soroban_server, logger)

# Criar novo jogo usando nova implementação
new_create_new_game(
    my_wallet,
    CONTRACT_ID,
    [
        scval.to_address(my_wallet.public_key),
        scval.to_string("player_new"),
        scval.to_int32(150),
        scval.to_int32(15),
    ],
    soroban_server,
    logger,
)

# Ler ranking novamente para verificar a adição
new_get_rank(my_wallet, CONTRACT_ID, soroban_server, logger)
