import { STELLAR_CONFIG } from './stellar'

interface LaunchtubeResponse {
  success: boolean
  data?: any
  error?: string
}

interface TransactionRequest {
  contractId: string
  method: string
  args?: any[]
  publicKey: string
}

interface SignedTransaction {
  xdr: string
  hash: string
}

class LaunchtubeService {
  private baseUrl: string
  private jwt: string

  constructor() {
    this.baseUrl = STELLAR_CONFIG.launchtubeUrl
    this.jwt = STELLAR_CONFIG.launchtubeJwt
    
    if (!this.jwt) {
      throw new Error('Launchtube JWT não configurado')
    }
  }

  // Método removido - usando fetch direto nos métodos específicos

  async submitTransaction(xdr: string): Promise<any> {
    try {
      const formData = new FormData()
      formData.append('xdr', xdr)
      formData.append('sim', 'true')

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.jwt}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Launchtube submit error:', error)
      throw error
    }
  }

  async submitHostFunction(func: string, auth: string[] = []): Promise<any> {
    try {
      const formData = new FormData()
      formData.append('func', func)
      auth.forEach(authEntry => {
        formData.append('auth', authEntry)
      })
      formData.append('sim', 'true')

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.jwt}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Launchtube host function error:', error)
      throw error
    }
  }

  async getCredits(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.jwt}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const credits = await response.text()
      return parseInt(credits, 10)
    } catch (error) {
      console.error('Launchtube credits error:', error)
      throw error
    }
  }
}

export const launchtubeService = new LaunchtubeService()
export type { TransactionRequest, SignedTransaction }