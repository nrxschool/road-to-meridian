import { Toaster } from 'sonner';

interface ToasterProviderProps {
  children: React.ReactNode;
}

export const ToasterProvider = ({ children }: ToasterProviderProps) => {
  return (
    <>
      <Toaster 
        position="top-center" 
        expand={true}
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            background: '#1a1a1a',
            border: '2px solid #333',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: '14px',
            boxShadow: '4px 4px 0px #000',
          },
        }}
      />
      {children}
    </>
  );
};