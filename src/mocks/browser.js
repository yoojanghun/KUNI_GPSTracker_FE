import { setupWorker } from 'msw/browser'
import { handlers } from './handler.js'

export const worker = setupWorker(...handlers);