import { launchtubeService } from './launchtube'

interface PasskeySignerOptions {
  credentialId: string
  publicKey: string
}

class PasskeySigner {
  private credentialId: string
  private publicKey: string

  constructor(options: PasskeySignerOptions) {
    this.credentialId = options.credentialId
    this.publicKey = options.publicKey
  }

  async signTransaction(transactionXdr: string): Promise<string> {
    try {
      // Create challenge from transaction XDR
      const challenge = new TextEncoder().encode(transactionXdr)
      
      // Use WebAuthn to sign the transaction with passkey
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [{
            type: 'public-key',
            id: this.base64urlToBuffer(this.credentialId),
          }],
          userVerification: 'required',
          timeout: 60000,
        },
      }) as PublicKeyCredential

      if (!assertion) {
        throw new Error('Failed to get assertion from passkey')
      }

      // Extract signature from assertion
      const response = assertion.response as AuthenticatorAssertionResponse
      const signature = new Uint8Array(response.signature)
      
      // Convert signature to base64 for Stellar
      const signatureBase64 = btoa(String.fromCharCode(...signature))
      
      // Create signed transaction XDR
      // This is a simplified approach - in a real implementation,
      // you would need to properly construct the Stellar transaction
      // with the signature
      return this.createSignedXdr(transactionXdr, signatureBase64)
      
    } catch (error) {
      console.error('Transaction signing error:', error)
      throw new Error(`Failed to sign transaction: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private createSignedXdr(transactionXdr: string, signature: string): string {
    // This is a simplified implementation
    // In a real scenario, you would need to properly construct
    // the signed transaction XDR using Stellar SDK
    
    // For now, we'll return the original XDR with a marker
    // indicating it's been "signed" with passkey
    return transactionXdr + ':signed:' + signature.substring(0, 20)
  }

  private base64urlToBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(base64)
    const buffer = new ArrayBuffer(binary.length)
    const bytes = new Uint8Array(buffer)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return buffer
  }
}

export { PasskeySigner }
export type { PasskeySignerOptions }