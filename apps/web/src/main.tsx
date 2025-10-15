import { RouterProvider, createRouter } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'

import { AuthProvider, NotificationProvider, TaskProvider, UserProvider } from './contexts'
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
    <AuthProvider>
        <TaskProvider>
            <NotificationProvider>
                <UserProvider>
                    <RouterProvider router={router} />
                </UserProvider>
            </NotificationProvider>
        </TaskProvider>
    </AuthProvider>
  )
}
