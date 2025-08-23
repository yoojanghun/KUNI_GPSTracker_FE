import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { worker } from './mocks/browser';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.ts';

if (import.meta.env.MODE === "development") {
  worker.start();
}

// ★ 캐시 이벤트 구독 (manageCars만 필터링)
queryClient.getQueryCache().subscribe((event) => {
  const q = event?.query;
  if (!q) return;
  const key = q.queryKey;
  if (Array.isArray(key) && key[0] === 'manageCars') {
  }
});

createRoot(document.getElementById("root")!).render(
      <QueryClientProvider client={queryClient}>
           <App />
      </QueryClientProvider>     
 

);
