import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import RootLayout from './components/RootLayout.jsx'
import { RouteLoading, RouteLoadError } from './components/RouteStatus.jsx'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    hydrateFallbackElement: <RouteLoading />,
    errorElement: <RouteLoadError />,
    children: [
      { path: '/', element: <App /> },
      {
        path: '/works',
        lazy: async () => ({ Component: (await import('./pages/WorksPage.jsx')).default }),
      },
      {
        path: '/works/suno',
        lazy: async () => ({ Component: (await import('./pages/SunoPage.jsx')).default }),
      },
      {
        path: '/works/ai-mix-renewal',
        lazy: async () => ({ Component: (await import('./pages/AIMixRenewalPage.jsx')).default }),
      },
      {
        path: '/works/mms-admin',
        lazy: async () => ({ Component: (await import('./pages/MMSAdminPage.jsx')).default }),
      },
      {
        path: '/about',
        lazy: async () => ({ Component: (await import('./pages/AboutPage.jsx')).default }),
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
