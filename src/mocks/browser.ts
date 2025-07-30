import { setupWorker } from 'msw/browser';
import { handlers } from './handler';

console.log("🔧 MSW handlers registered:", handlers.map(h => h.info?.path));

export const worker = setupWorker(...handlers);