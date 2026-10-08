import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import './styles/tokens.css'
import './styles/base.css'
import './components/ui/Button.css'
import { ThemeProvider } from './providers/ThemeProvider'
import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import { router } from './app/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SmoothScrollProvider>
        <RouterProvider router={router} />
      </SmoothScrollProvider>
    </ThemeProvider>
  </StrictMode>,
)
