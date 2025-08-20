import { Toaster } from "sonner";

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
      />
      {children}
    </>
  );
};
