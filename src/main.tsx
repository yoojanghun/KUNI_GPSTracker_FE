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
    console.log('[RQ cache event]', {
      type: event?.type,                 // 'added' | 'removed' | 'updated'
      state: q.state.status,             // 'pending' | 'success' | 'error' | 'idle'
      dataUpdatedAt: q.state.dataUpdatedAt,
      fetchStatus: q.state.fetchStatus,  // 'fetching' | 'paused' | 'idle'
      isInvalidated: q.invalidate(),  // 무효화 여부
      key,
    });
  }
});

createRoot(document.getElementById("root")!).render(
           
    <App />

);
