import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/index.css'
import App from './app/App.jsx'
import ErrorBoundary from './app/ErrorBoundary.jsx'
import ErrorComponent from './shared/ui/ErrorComponent.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary
        fallback={ ErrorComponent }
    >
        <App />
    </ErrorBoundary>
  </StrictMode>,
)
