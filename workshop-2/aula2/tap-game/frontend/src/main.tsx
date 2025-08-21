import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ContractProvider } from './blockchain/providers/ContractProvider';

createRoot(document.getElementById('root')!).render(
  <ContractProvider>
    <App />
  </ContractProvider>
);
