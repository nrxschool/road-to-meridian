from stellar_sdk import SorobanServer
from stellar_sdk.contract import ContractClient
from .stellar import get_main_keypair
from ..config import settings


def get_soroban_server() -> SorobanServer:
    return SorobanServer(settings.soroban_rpc_url)


def make_contract_client(contract_id: str) -> ContractClient:
    soroban = get_soroban_server()
    network_passphrase = soroban.get_network().passphrase
    return ContractClient(
        contract_id=contract_id,
        rpc_url=soroban.server_url,
        network_passphrase=network_passphrase,
    )