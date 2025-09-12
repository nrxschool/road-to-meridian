import React from 'react';
import { AlertCircle, Fingerprint, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/Alert';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';

interface TouchIDSetupProps {
  onRetry: () => void;
}

export const TouchIDSetup: React.FC<TouchIDSetupProps> = ({ onRetry }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Fingerprint className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle>Configure o Touch ID</CardTitle>
        <CardDescription>
          Para usar a autenticação biométrica, você precisa configurar o Touch ID no seu Mac
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuração Necessária</AlertTitle>
          <AlertDescription>
            O Touch ID não está configurado ou disponível no seu dispositivo.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Como configurar:
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Abra <strong>Ajustes do Sistema</strong> no seu Mac</li>
            <li>Clique em <strong>Touch ID e Senha</strong></li>
            <li>Digite sua senha quando solicitado</li>
            <li>Clique em <strong>Adicionar Impressão Digital</strong></li>
            <li>Siga as instruções para registrar sua impressão digital</li>
            <li>Certifique-se de que as opções estão habilitadas:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Desbloquear o Mac</li>
                <li>Preencher senhas automaticamente</li>
              </ul>
            </li>
          </ol>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Requisitos</AlertTitle>
          <AlertDescription className="space-y-1">
            <div>• macOS Ventura (13) ou superior</div>
            <div>• iCloud Keychain habilitado</div>
            <div>• Autenticação de dois fatores ativa no Apple ID</div>
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button 
            onClick={onRetry} 
            className="flex-1"
          >
            Tentar Novamente
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open('https://support.apple.com/guide/mac-help/use-touch-id-mchl16fbf90a/mac', '_blank')}
            className="flex-1"
          >
            Ver Guia
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};