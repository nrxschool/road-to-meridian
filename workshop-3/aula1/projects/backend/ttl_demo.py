
import stellar_sdk
from stellar_sdk import Keypair, Network, SorobanServer, TransactionBuilder
from stellar_sdk.soroban_rpc import GetTransactionStatus
import time

class TTLDemo:
    def __init__(self):
        # Configuração da rede Stellar (Testnet)
        self.network = Network.TESTNET_NETWORK_PASSPHRASE
        self.soroban_server = SorobanServer("https://soroban-testnet.stellar.org")
        
        # Keypair para assinar transações
        self.source_keypair = Keypair.random()
        
        # ID do contrato (será definido após deploy)
        self.contract_id = None
        
    def fund_account(self):
        """Financia a conta na testnet usando o Friendbot"""
        print(f"Financiando conta: {self.source_keypair.public_key}")
        
        import requests
        response = requests.get(
            f"https://friendbot.stellar.org?addr={self.source_keypair.public_key}"
        )
        
        if response.status_code == 200:
            print("✅ Conta financiada com sucesso!")
        else:
            print(f"❌ Erro ao financiar conta: {response.status_code}")
            
    def deploy_contract(self, wasm_path: str):
        """Faz deploy do contrato TTL"""
        print("📦 Fazendo deploy do contrato TTL...")
        
        # Aqui você faria o deploy real do contrato
        # Por simplicidade, vamos simular com um ID fictício
        self.contract_id = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK6Z62"
        print(f"✅ Contrato deployado com ID: {self.contract_id}")
        
    def store_temp_data(self, key: str, value: int):
        """Armazena dados temporários no contrato"""
        print(f"💾 Armazenando dados temporários: {key} = {value}")
        
        # Simula chamada para o contrato
        print(f"📞 Chamando store_temp_data('{key}', {value})")
        print("✅ Dados temporários armazenados com TTL de 100 ledgers")
        
    def store_persistent_data(self, key: str, value: int):
        """Armazena dados persistentes no contrato"""
        print(f"💾 Armazenando dados persistentes: {key} = {value}")
        
        # Simula chamada para o contrato
        print(f"📞 Chamando store_persistent_data('{key}', {value})")
        print("✅ Dados persistentes armazenados com TTL de 1000 ledgers")
        
    def store_instance_data(self, key: str, value: int):
        """Armazena dados de instância no contrato"""
        print(f"💾 Armazenando dados de instância: {key} = {value}")
        
        # Simula chamada para o contrato
        print(f"📞 Chamando store_instance_data('{key}', {value})")
        print("✅ Dados de instância armazenados com TTL de 10000 ledgers")
        
    def get_data(self, storage_type: str, key: str):
        """Recupera dados do contrato"""
        print(f"🔍 Buscando dados {storage_type}: {key}")
        
        # Simula chamada para o contrato
        if storage_type == "temp":
            print(f"📞 Chamando get_temp_data('{key}')")
        elif storage_type == "persistent":
            print(f"📞 Chamando get_persistent_data('{key}')")
        elif storage_type == "instance":
            print(f"📞 Chamando get_instance_data('{key}')")
            
        # Simula retorno
        return 42  # Valor fictício
        
    def check_data_exists(self, storage_type: str, key: str):
        """Verifica se dados existem"""
        print(f"❓ Verificando se dados {storage_type} existem: {key}")
        
        # Simula chamada para o contrato
        if storage_type == "temp":
            print(f"📞 Chamando has_temp_data('{key}')")
        elif storage_type == "persistent":
            print(f"📞 Chamando has_persistent_data('{key}')")
        elif storage_type == "instance":
            print(f"📞 Chamando has_instance_data('{key}')")
            
        # Simula retorno (True para dados existentes)
        return True
        
    def extend_ttl(self, storage_type: str, key: str, extend_to: int):
        """Estende o TTL dos dados"""
        print(f"⏰ Estendendo TTL de dados {storage_type}: {key} para {extend_to} ledgers")
        
        # Simula chamada para o contrato
        if storage_type == "temp":
            print(f"📞 Chamando extend_temp_ttl('{key}', {extend_to})")
        elif storage_type == "persistent":
            print(f"📞 Chamando extend_persistent_ttl('{key}', {extend_to})")
        elif storage_type == "instance":
            print(f"📞 Chamando extend_instance_ttl({extend_to})")
            
        print(f"✅ TTL estendido para {extend_to} ledgers")
        
    def simulate_time_passage(self, ledgers: int):
        """Simula a passagem de tempo (ledgers)"""
        print(f"⏳ Simulando passagem de {ledgers} ledgers...")
        time.sleep(1)  # Simula tempo
        print(f"✅ {ledgers} ledgers passaram")
        
    def demonstrate_ttl_expiration(self):
        """Demonstra o que acontece quando TTL expira"""
        print("\n🔬 === DEMONSTRAÇÃO DE EXPIRAÇÃO DE TTL ===")
        
        # Armazena dados temporários
        self.store_temp_data("temp_key", 100)
        
        # Verifica se dados existem
        exists_before = self.check_data_exists("temp", "temp_key")
        print(f"📊 Dados existem antes da expiração: {exists_before}")
        
        # Simula passagem de tempo além do TTL
        self.simulate_time_passage(101)  # Mais que os 100 ledgers do TTL
        
        # Verifica se dados ainda existem
        exists_after = self.check_data_exists("temp", "temp_key")
        print(f"📊 Dados existem após expiração: {exists_after}")
        
        if not exists_after:
            print("❌ Dados expiraram! TTL funcionou corretamente.")
        else:
            print("⚠️  Dados ainda existem (simulação)")
            
    def demonstrate_ttl_extension(self):
        """Demonstra como estender TTL"""
        print("\n🔧 === DEMONSTRAÇÃO DE EXTENSÃO DE TTL ===")
        
        # Armazena dados temporários
        self.store_temp_data("extend_key", 200)
        
        # Simula passagem de tempo próxima à expiração
        self.simulate_time_passage(90)  # 90 de 100 ledgers
        
        # Verifica se dados ainda existem
        exists = self.check_data_exists("temp", "extend_key")
        print(f"📊 Dados existem após 90 ledgers: {exists}")
        
        # Estende o TTL
        self.extend_ttl("temp", "extend_key", 200)
        
        # Simula mais passagem de tempo
        self.simulate_time_passage(50)  # Mais 50 ledgers
        
        # Verifica se dados ainda existem
        exists_after_extension = self.check_data_exists("temp", "extend_key")
        print(f"📊 Dados existem após extensão: {exists_after_extension}")
        
        if exists_after_extension:
            print("✅ TTL estendido com sucesso! Dados preservados.")
            
    def compare_storage_types(self):
        """Compara diferentes tipos de storage"""
        print("\n📊 === COMPARAÇÃO DE TIPOS DE STORAGE ===")
        
        # Armazena dados em todos os tipos
        self.store_temp_data("compare", 1)
        self.store_persistent_data("compare", 2)
        self.store_instance_data("compare", 3)
        
        print("\n📋 Resumo dos tipos de storage:")
        print("🔸 Temporary: TTL baixo (100 ledgers) - dados temporários")
        print("🔸 Persistent: TTL médio (1000 ledgers) - dados importantes")
        print("🔸 Instance: TTL alto (10000 ledgers) - configurações")
        
        print("\n💡 Dicas de uso:")
        print("• Use Temporary para cache e dados descartáveis")
        print("• Use Persistent para dados de usuário importantes")
        print("• Use Instance para configurações do contrato")
        
    def run_demo(self):
        """Executa a demonstração completa"""
        print("🚀 === DEMO DO CONTRATO TTL ===")
        print("Este script demonstra o uso de TTL em smart contracts Stellar\n")
        
        # Configura ambiente
        self.fund_account()
        self.deploy_contract("ttl_contract.wasm")
        
        # Executa demonstrações
        self.compare_storage_types()
        self.demonstrate_ttl_extension()
        self.demonstrate_ttl_expiration()
        
        print("\n🎉 Demonstração concluída!")
        print("\n📚 Pontos importantes sobre TTL:")
        print("• TTL previne acúmulo de dados desnecessários")
        print("• Diferentes tipos de storage têm TTLs apropriados")
        print("• TTL pode ser estendido quando necessário")
        print("• Dados expirados são automaticamente removidos")

if __name__ == "__main__":
    demo = TTLDemo()
    demo.run_demo()