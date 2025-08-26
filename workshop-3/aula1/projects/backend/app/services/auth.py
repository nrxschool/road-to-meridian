from fastapi import HTTPException
from stellar_sdk import Keypair, scval
from .client import make_contract_client
from ..config import settings

# Armazenamento simples em memória para chaves geradas
_KEYS: list[Keypair] = []


def list_keys() -> list[dict]:
    return [
        {"id": i, "public_key": kp.public_key}
        for i, kp in enumerate(_KEYS)
    ]


def new_key() -> dict:
    kp = Keypair.random()
    _KEYS.append(kp)
    return {"id": len(_KEYS) - 1, "public_key": kp.public_key}


def _require_auth_contract_id() -> str:
    cid = settings.auth_contract_id
    if not cid:
        raise HTTPException(status_code=500, detail="AUTH_CONTRACT_ID não configurado (.env)")
    return cid


def flip_with_key(key_id: int) -> dict:
    cid = _require_auth_contract_id()
    if key_id < 0 or key_id >= len(_KEYS):
        raise HTTPException(status_code=404, detail="Chave não encontrada")
    kp = _KEYS[key_id]
    client = make_contract_client(cid)
    assembled = client.invoke(
        function_name="flip",
        parameters=[],
        source=kp.public_key,
        signer=kp,
    )
    resp = assembled.sign_and_submit()
    tx_hash = None
    if hasattr(assembled, "get_transaction_response") and assembled.get_transaction_response:
        tx_hash = assembled.get_transaction_response.transaction_hash
    return {"status": "submitted", "tx_hash": tx_hash}


def get_state() -> dict:
    cid = _require_auth_contract_id()
    client = make_contract_client(cid)

    # get()
    assembled_get = client.invoke(
        function_name="get",
        parameters=[],
        parse_result_xdr_fn=lambda x: scval.to_native(x),
        simulate=True,
    )
    state_val = assembled_get.result()

    # get_owner() (se exposta)
    owner = None
    try:
        assembled_owner = client.invoke(
            function_name="get_owner",
            parameters=[],
            parse_result_xdr_fn=lambda x: scval.to_native(x),
            simulate=True,
        )
        owner = assembled_owner.result()
    except Exception:
        owner = None

    return {"state": state_val, "owner": owner}