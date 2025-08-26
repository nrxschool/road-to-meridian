from fastapi import APIRouter
from enum import Enum
from ..services import ttl as ttl_service

router = APIRouter(prefix="/storage", tags=["Storage Types"])

class StorageType(str, Enum):
    instance = "instance"
    temporary = "temporary"
    persistent = "persistent"


@router.get("/ttl")
async def get_ttl():
    return ttl_service.get_ttl_summary()


@router.post("/ttl/extend")
async def extend_ttl(storage_type: StorageType, extend_by: int = 43200):
    return ttl_service.extend_ttl(storage_type.value, extend_by)


@router.get("/counter/{storage_type}")
async def get_counter(storage_type: StorageType):
    return {"storage_type": storage_type.value, "counter": ttl_service.get_counter(storage_type.value)}


@router.post("/counter/{storage_type}/increment")
async def acc_counter(storage_type: StorageType):
    return ttl_service.acc_counter(storage_type.value)