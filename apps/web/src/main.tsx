import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { AuthProvider, LoadingProvider, NotificationProvider, TaskProvider } from './contexts'
import { routeTree } from './routeTree.gen'

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
            <NotificationProvider>
                <RouterProvider router={router} />
            </NotificationProvider>
          </LoadingProvider>
        </TaskProvider>
      </AuthProvider>
    </StrictMode>,
  )
}
