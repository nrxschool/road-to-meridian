import time
from stellar_sdk import Keypair, Network, TransactionBuilder, scval
from stellar_sdk import SorobanServer
from stellar_sdk.exceptions import NotFoundError, BadRequestError
from logging import Logger
from itertools import cycle
from stellar_sdk import Keypair, Network, SorobanServer, TransactionBuilder, scval, xdr
from stellar_sdk.soroban_rpc import GetTransactionStatus, SendTransactionStatus
from stellar_sdk.exceptions import PrepareTransactionException


def decode_error_result_xdr(error_result_xdr: str, logger: Logger):
    """
    Decodifica o error_result_xdr para entender o erro da transação
    """
    try:
        transaction_result = xdr.TransactionResult.from_xdr(error_result_xdr)
        error_code = transaction_result.result.code

        error_messages = {
            -1: "txFAILED: Transação falhou",
            -2: "txTOO_EARLY: Transação muito cedo",
            -3: "txTOO_LATE: Transação muito tarde",
            -4: "txMISSING_OPERATION: Operação ausente",
            -5: "txBAD_SEQ: Número de sequência inválido",
            -6: "txBAD_AUTH: Assinatura inválida",
            -7: "txINSUFFICIENT_BALANCE: Saldo insuficiente",
            -8: "txNO_ACCOUNT: Conta não existe",
            -9: "txINSUFFICIENT_FEE: Taxa insuficiente",
            -10: "txBAD_AUTH_EXTRA: Assinatura extra inválida",
            -11: "txINTERNAL_ERROR: Erro interno",
            -12: "txNOT_SUPPORTED: Não suportado",
            -13: "txFEE_BUMP_INNER_FAILED: Fee bump inner falhou",
            -14: "txBAD_SPONSORSHIP: Sponsorship inválido",
            -15: "txBAD_MIN_SEQ_AGE_OR_GAP: Min seq age ou gap inválido",
            -16: "txMALFORMED: Transação malformada",
            -17: "txSOROBAN_INVALID: Soroban inválido",
        }

        error_msg = error_messages.get(error_code, f"Erro desconhecido: {error_code}")
        logger.error(f"🔍 Código do erro: {error_code}")
        logger.error(f"📝 Descrição: {error_msg}")

        return error_code, error_msg

    except Exception as e:
        logger.error(f"❌ Erro ao decodificar XDR: {e}")
        return None, None


def format_result_for_display(result, logger: Logger):
    """
    Formata o resultado para exibição na tela de forma amigável
    """
    if result is None:
        return "❌ Nenhum resultado retornado"
    
    result_type = type(result).__name__
    logger.info(f"📊 Tipo do resultado: {result_type}")
    
    if isinstance(result, list):
        if len(result) == 0:
            return "📋 Lista vazia - Nenhum item encontrado"
        else:
            formatted_items = []
            for i, item in enumerate(result):
                if isinstance(item, dict):
                    formatted_items.append(f"  [{i}] {format_dict_item(item)}")
                else:
                    formatted_items.append(f"  [{i}] {item}")
            return f"📋 Lista com {len(result)} item(s):\n" + "\n".join(formatted_items)
    
    elif isinstance(result, dict):
        return f"📦 Objeto: {format_dict_item(result)}"
    
    elif isinstance(result, str):
        return f"📝 Texto: '{result}'"
    
    elif isinstance(result, (int, float)):
        return f"🔢 Número: {result}"
    
    elif isinstance(result, bool):
        return f"✅ Booleano: {'Verdadeiro' if result else 'Falso'}"
    
    else:
        return f"🔍 Valor: {result} (tipo: {result_type})"


def format_dict_item(item):
    """
    Formata um item de dicionário para exibição
    """
    if not isinstance(item, dict):
        return str(item)
    
    formatted_pairs = []
    for key, value in item.items():
        if isinstance(value, str):
            formatted_pairs.append(f"{key}: '{value}'")
        else:
            formatted_pairs.append(f"{key}: {value}")
    
    return "{" + ", ".join(formatted_pairs) + "}"


def invoke_function_improved(
    keypair: Keypair,
    contract_id: str,
    function_name: str,
    params: list,
    soroban: SorobanServer,
    logger: Logger,
):
    """
    Versão melhorada da função invoke_function com melhor tratamento de retorno
    """
    logger.info(f"🚀 Iniciando invoke_function para {function_name}")
    logger.info(f"📋 Contract ID: {contract_id}")
    logger.info(f"📥 Parâmetros: {params}")

    sender_account = soroban.load_account(keypair.public_key)
    logger.info(f"👤 Conta carregada: {keypair.public_key}")

    tx = (
        TransactionBuilder(sender_account, Network.TESTNET_NETWORK_PASSPHRASE, 100)
        .set_timeout(300)
        .append_invoke_contract_function_op(
            contract_id=contract_id,
            function_name=function_name,
            parameters=params,
        )
        .build()
    )
    logger.info("📝 Transação construída com sucesso")

    # Prepara e assina a transação
    try:
        tx = soroban.prepare_transaction(tx)
        logger.info("✅ Transação preparada com sucesso")
    except PrepareTransactionException as e:
        logger.error(f"🚨 Erro antes de enviar a transação\n{'👇' * 30}\n{e.simulate_transaction_response.error}")
        raise

    tx.sign(keypair)
    logger.info("✍️ Transação assinada com sucesso")

    # Envia a transação
    try:
        response = soroban.send_transaction(tx)
        logger.info("📤 Transação enviada com sucesso")
    except Exception as e:
        logger.error(f"🚨 Erro ao enviar a transação: {e}")
        raise
        
    if response.status == SendTransactionStatus.ERROR:
        logger.error(f"🚨 Erro ao enviar a transação: {response}")
        if response.error_result_xdr:
            logger.error("🔍 Decodificando erro da transação:")
            decode_error_result_xdr(response.error_result_xdr, logger)
        raise Exception(f"Transaction failed with status: {response.status}")

    # Hash da transação para confirmar o status
    tx_hash = response.hash
    logger.info("🔗 https://stellar.expert/explorer/testnet/tx/" + tx_hash)
    logger.info(f"🆔 Transaction hash: {tx_hash}")

    # Animação de espera e verificação de status da transação
    clocks = cycle(["|", "/", "-", "\\", "|", "/", "-", "\\"])
    attempt = 0
    while True:
        attempt += 1
        print(
            f"\r⏰ Esperando transação confirmar {next(clocks)} (tentativa {attempt})",
            end="",
        )
        get_transaction_data = soroban.get_transaction(tx_hash)
        if get_transaction_data.status != GetTransactionStatus.NOT_FOUND:
            logger.info(f"✅ Transação encontrada após {attempt} tentativas")
            break

    # Limpa a linha de animação após confirmação
    print("\r" + "" * 60, end="\r")

    # Verifica o status final da transação
    if get_transaction_data.status != GetTransactionStatus.SUCCESS:
        logger.error(f"🚨 Transação falhou: {get_transaction_data.result_xdr}")
        return None
    else:
        logger.info("✅ Transação completada com sucesso")

    # Extrai e retorna o resultado com verificações robustas
    try:
        transaction_meta = xdr.TransactionMeta.from_xdr(
            get_transaction_data.result_meta_xdr
        )
        
        # Verifica a versão dos metadados da transação (v4 ou v3)
        transaction_meta_body = transaction_meta.v4 or transaction_meta.v3
        
        if transaction_meta_body is None:
            logger.error("🚨 Metadados da transação não encontrados")
            return None
        
        if transaction_meta_body.soroban_meta is None:
            logger.error("🚨 Metadados do Soroban não encontrados")
            return None
        
        if transaction_meta_body.soroban_meta.return_value is None:
            logger.warning("⚠️ Função não retornou valor")
            return None
        
        # Converte o valor de retorno para tipo Python nativo
        result = scval.to_native(transaction_meta_body.soroban_meta.return_value)
        
        # Log detalhado do resultado
        logger.info(f"📊 Resultado bruto: {result}")
        
        # Formata e exibe o resultado de forma amigável
        formatted_result = format_result_for_display(result, logger)
        logger.info(f"📋 Resultado formatado:\n{formatted_result}")
        
        return result
        
    except Exception as e:
        logger.error(f"🚨 Erro ao processar resultado da transação: {e}")
        return None


def get_rank_improved(source_keypair: Keypair, contract_id: str, soroban: SorobanServer, logger: Logger):
    """
    Versão melhorada da função get_rank
    """
    logger.warning("=" * 30 + "GET_RANK_IMPROVED" + "=" * 30)
    
    result = invoke_function_improved(source_keypair, contract_id, "get_rank", [], soroban, logger)
    
    if result is not None:
        logger.info(f"🎯 Ranking obtido com sucesso!")
        
        # Exibe o resultado na tela de forma organizada
        print("\n" + "=" * 50)
        print("🏆 RANKING DO JOGO")
        print("=" * 50)
        
        if isinstance(result, list) and len(result) == 0:
            print("📋 Nenhum jogador no ranking ainda.")
        elif isinstance(result, list):
            for i, player in enumerate(result, 1):
                print(f"{i}º lugar: {player}")
        else:
            print(f"Resultado: {result}")
        
        print("=" * 50 + "\n")
    else:
        logger.error("❌ Falha ao obter ranking")
    
    return result