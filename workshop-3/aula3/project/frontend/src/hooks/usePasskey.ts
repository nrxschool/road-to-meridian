import { useState, useCallback, useEffect } from 'react';

interface PasskeyCredential {
  id: string;
  publicKey: string;
}

interface UsePasskeyReturn {
  isSupported: boolean;
  isLoading: boolean;
  error: string | null;
  credential: PasskeyCredential | null;
  createPasskey: () => Promise<void>;
  authenticatePasskey: () => Promise<void>;
  clearError: () => void;
}

export const usePasskey = (): UsePasskeyReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credential, setCredential] = useState<PasskeyCredential | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Check if WebAuthn is supported
  const isSupported = typeof window !== 'undefined' && 
    'navigator' in window && 
    'credentials' in navigator &&
    'create' in navigator.credentials &&
    'get' in navigator.credentials;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize saved passkey on mount
  useEffect(() => {
    const initializeSavedPasskey = () => {
      const savedCredentialId = localStorage.getItem('passkey_credential_id');
      const savedPublicKey = localStorage.getItem('passkey_public_key');
      
      if (savedCredentialId && savedPublicKey) {
        setCredential({ id: savedCredentialId, publicKey: savedPublicKey });
      }
      
      setInitialized(true);
    };

    initializeSavedPasskey();
  }, []);

  const createPasskey = useCallback(async () => {
    if (!isSupported) {
      setError('WebAuthn não é suportado neste dispositivo/navegador');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate a unique credential ID
      const credentialId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
      
      // Create passkey using WebAuthn with native Touch ID
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new TextEncoder().encode('wallet-challenge'),
          rp: {
            name: 'Wallet App',
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(credentialId),
            name: `wallet-user-${Date.now()}`,
            displayName: 'Wallet User',
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' }, // ES256
            { alg: -257, type: 'public-key' } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform', // Forces platform authenticator (Touch ID/Face ID)
            userVerification: 'required', // Requires biometric verification
            requireResidentKey: false,
          },
          timeout: 60000,
          attestation: 'direct', // Request direct attestation for better platform integration
        },
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Falha ao criar passkey');
      }

      // Generate a Stellar-like public key
      const publicKey = generateStellarPublicKey(credential.id);
      
      // Save to localStorage
      localStorage.setItem('passkey_credential_id', credential.id);
      localStorage.setItem('passkey_public_key', publicKey);

      setCredential({ id: credential.id, publicKey });
    } catch (error: any) {
      console.error('Passkey creation error:', error);
      if (error.name === 'NotAllowedError') {
        setError('Operação cancelada pelo usuário ou Touch ID não disponível');
      } else if (error.name === 'NotSupportedError') {
        setError('Touch ID não está configurado neste dispositivo');
      } else if (error.name === 'InvalidStateError') {
        setError('Passkey já existe para este dispositivo');
      } else {
        setError(`Falha ao criar passkey: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const authenticatePasskey = useCallback(async () => {
    if (!isSupported) {
      setError('WebAuthn não é suportado neste dispositivo/navegador');
      return;
    }

    const savedCredentialId = localStorage.getItem('passkey_credential_id');
    const savedPublicKey = localStorage.getItem('passkey_public_key');

    if (!savedCredentialId || !savedPublicKey) {
      setError('Nenhum passkey encontrado. Crie um primeiro.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Authenticate with existing passkey using native Touch ID
      await navigator.credentials.get({
        publicKey: {
          challenge: new TextEncoder().encode('wallet-auth-challenge'),
          allowCredentials: [{
            type: 'public-key',
            id: base64urlToBuffer(savedCredentialId),
          }],
          userVerification: 'required', // Forces biometric verification
          timeout: 60000,
        },
      });

      setCredential({ id: savedCredentialId, publicKey: savedPublicKey });
    } catch (error: any) {
      console.error('Passkey authentication error:', error);
      if (error.name === 'NotAllowedError') {
        setError('Autenticação cancelada pelo usuário');
      } else if (error.name === 'InvalidStateError') {
        setError('Passkey não encontrado ou inválido');
      } else {
        setError(`Falha na autenticação: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    isLoading,
    error,
    credential,
    createPasskey,
    authenticatePasskey,
    clearError,
  };
};

// Generate a Stellar-like public key based on credential ID
function generateStellarPublicKey(credentialId: string): string {
  const hash = simpleHash(credentialId);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = 'G'; // Stellar public keys start with G
  
  for (let i = 0; i < 55; i++) {
    result += chars[hash[i % hash.length] % chars.length];
  }
  
  return result;
}

function simpleHash(str: string): number[] {
  const hash = [];
  for (let i = 0; i < str.length; i++) {
    hash.push(str.charCodeAt(i));
  }
  return hash;
}

// Helper function to convert base64url to ArrayBuffer
function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return buffer;
}