import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react"
import { initializeFaro } from '@grafana/faro-web-sdk'
import './index.css'
import App from './App.jsx'

if (import.meta.env.VITE_FARO_URL) {
  initializeFaro({
    url: import.meta.env.VITE_FARO_URL,
    app: {
      name: 'esportcal-frontend',
      version: '1.0.0',
      environment: import.meta.env.MODE,
    },
  });
}

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN, // Set via Vite environment variable VITE_SENTRY_DSN
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
