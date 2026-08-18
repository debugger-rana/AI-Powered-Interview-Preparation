import { useEffect, useRef, useState } from "react"
import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"

function App() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
  const [isBackendReady, setIsBackendReady] = useState(false)
  const [showManualRetry, setShowManualRetry] = useState(false)
  const retryTimeoutRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    async function checkHealth() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/health`, {
          method: "GET"
        })

        if (response.ok && isMounted) {
          setIsBackendReady(true)
        }
      } catch (err) {
        // Keep polling until backend wakes up on free-tier cold starts.
      }
    }

    checkHealth()
    const intervalId = setInterval(checkHealth, 3000)
    retryTimeoutRef.current = setTimeout(() => {
      if (isMounted) {
        setShowManualRetry(true)
      }
    }, 60000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [API_BASE_URL])

  async function handleManualRetry() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: "GET"
      })

      if (response.ok) {
        setIsBackendReady(true)
      }
    } catch (err) {
      // Keep automatic retry flow active in the background.
    }
  }

  if (!isBackendReady) {
    return (
      <div className="startup-screen">
        <div className="startup-card animate-enter">
          <div className="spinner" />
          <h1>Preparing your workspace...</h1>
          <p>The server is starting. This may take a few seconds.</p>
          {showManualRetry && (
            <button className="button primary-button startup-retry" onClick={handleManualRetry}>
              Retry now
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
