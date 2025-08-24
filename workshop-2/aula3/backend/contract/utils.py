from logging import Logger
from stellar_sdk import xdr


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
