from typing import Literal
from fastapi import HTTPException
from stellar_sdk import scval
from .client import make_contract_client
from ..config import settings

StorageType = Literal["instance", "temporary", "persistent"]


def _require_ttl_contract_id() -> str:
    cid = settings.ttl_contract_id
    if not cid:
        raise HTTPException(status_code=500, detail="TTL_CONTRACT_ID não configurado (.env)")
    return cid


def get_counter(storage_type: StorageType) -> int:
    cid = _require_ttl_contract_id()
    client = make_contract_client(cid)
    fn_map = {
        "instance": "get_instance",
        "temporary": "get_temporary",
        "persistent": "get_persistent",
    }
    fn = fn_map[storage_type]
    assembled = client.invoke(
        function_name=fn,
        parameters=[],
        parse_result_xdr_fn=lambda x: scval.to_native(x),
        simulate=True,
    )
    result = assembled.result()
    if result is None:
        raise HTTPException(status_code=500, detail="Sem resultado do contrato")
    if not isinstance(result, int):
        raise HTTPException(status_code=500, detail="Formato inesperado de resultado")
    return result


def acc_counter(storage_type: StorageType) -> dict:
    cid = _require_ttl_contract_id()
    client = make_contract_client(cid)
    fn_map = {
        "instance": "acc_instance",
        "temporary": "acc_temporary",
        "persistent": "acc_persistent",
    }
    fn = fn_map[storage_type]
    assembled = client.invoke(
        function_name=fn,
        parameters=[],
    )
    resp = assembled.sign_and_submit()
    tx_hash = None
    if hasattr(assembled, "get_transaction_response") and assembled.get_transaction_response:
        tx_hash = assembled.get_transaction_response.transaction_hash
    return {"status": "submitted", "tx_hash": tx_hash}


# Placeholders educacionais para TTL de ledger/contract; podem ser implementados via Soroban RPC futuramente

def get_ttl_summary() -> dict:
    raise HTTPException(status_code=501, detail="get_ttl: não implementado ainda nesta versão modular")


def extend_ttl(storage_type: StorageType, extend_by: int) -> dict:
    raise HTTPException(status_code=501, detail="extend_ttl: não implementado ainda nesta versão modular")