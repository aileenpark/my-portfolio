import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import WorksPage from './pages/WorksPage.jsx'
import SunoPage from './pages/SunoPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import AIMixRenewalPage from './pages/AIMixRenewalPage.jsx'
import MMSAdminPage from './pages/MMSAdminPage.jsx'
import RootLayout from './components/RootLayout.jsx'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/works', element: <WorksPage /> },
      { path: '/works/suno', element: <SunoPage /> },
      { path: '/works/ai-mix-renewal', element: <AIMixRenewalPage /> },
      { path: '/works/mms-admin', element: <MMSAdminPage /> },
      { path: '/about', element: <AboutPage /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
