import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import { AuthProvider, LoadingProvider, TaskProvider } from './contexts'

import './global.css'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <AuthProvider>
        <TaskProvider>
          <LoadingProvider>
            <RouterProvider router={router} />
          </LoadingProvider>
        </TaskProvider>
      </AuthProvider>
    </StrictMode>,
  )
}