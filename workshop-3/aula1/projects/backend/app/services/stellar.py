from typing import Optional
from stellar_sdk import Keypair
from ..config import settings


def get_main_keypair() -> Optional[Keypair]:
    """Return main Keypair from PRIVATE_KEY if provided, else None (educational friendly)."""
    sk_raw = settings.private_key
    sk = str(sk_raw).strip() if sk_raw is not None else ""
    if not sk:
        return None
    try:
        return Keypair.from_secret(sk)
    except Exception:
        return None