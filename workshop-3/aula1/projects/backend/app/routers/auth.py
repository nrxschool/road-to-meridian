from fastapi import APIRouter
from ..services import auth as auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get("/keys")
async def list_keys():
    return auth_service.list_keys()


@router.post("/keys/new")
async def new_key():
    return auth_service.new_key()


@router.post("/flip")
async def flip_state(id: int):
    return auth_service.flip_with_key(id)


@router.get("/state")
async def get_state():
    return auth_service.get_state()