from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
from pydantic import Field

# Load environment variables from a .env file if present
load_dotenv()

class Settings(BaseSettings):
    # Network / RPC
    soroban_rpc_url: str = Field(default="https://rpc-futurenet.stellar.org", alias="SOROBAN_RPC_URL")
    stellar_network: str = Field(default="FUTURENET", alias="STELLAR_NETWORK")

    # Secrets and contracts
    private_key: str = Field(default="", alias="PRIVATE_KEY")
    ttl_contract_id: str = Field(default="", alias="TTL_CONTRACT_ID")
    auth_contract_id: str = Field(default="", alias="AUTH_CONTRACT_ID")

    # CORS
    cors_allow_origins: list[str] = Field(default_factory=lambda: ["*"])

    model_config = SettingsConfigDict(env_file=".env", env_nested_delimiter='__', extra='ignore')

settings = Settings()  # Singleton-style settings object