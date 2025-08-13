import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { worker } from './mocks/browser';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.ts';

if (import.meta.env.MODE === "development") {
  worker.start();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
  
  </StrictMode>
);
