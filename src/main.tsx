import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { applyColors } from './theme';
import './index.css';
import App from './App';

applyColors();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
