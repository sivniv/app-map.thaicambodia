'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-red-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="text-center">
              <svg
                className="mx-auto h-24 w-24 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h1 className="mt-6 text-5xl font-bold text-red-600">Critical Error</h1>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">Application Failed to Load</h2>
              <p className="mt-4 text-lg text-gray-700">
                A critical error has occurred that prevented the application from loading properly.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                This is a serious issue that requires immediate attention.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={reset}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-lg"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Restart Application
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-lg"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reload Page
                </button>
              </div>
            </div>

            {/* Error details for development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-6 bg-red-100 border border-red-300 rounded-lg">
                <h3 className="text-lg font-medium text-red-800 mb-3">
                  Global Error Details (Development Mode)
                </h3>
                <details className="text-sm text-red-700">
                  <summary className="cursor-pointer font-medium mb-2">
                    Click to view technical details
                  </summary>
                  <div className="mt-3 p-3 bg-white rounded border border-red-200">
                    <pre className="whitespace-pre-wrap break-all text-xs">
                      <strong>Error:</strong> {error.message}
                      {error.stack && (
                        <>
                          {'\n\n'}
                          <strong>Stack Trace:</strong>
                          {'\n'}
                          {error.stack}
                        </>
                      )}
                      {error.digest && (
                        <>
                          {'\n\n'}
                          <strong>Error ID:</strong> {error.digest}
                        </>
                      )}
                    </pre>
                  </div>
                </details>
              </div>
            )}

            <div className="mt-8 border-t border-red-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                Recovery Steps
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                        1
                      </span>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Try restarting the application</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Click &quot;Restart Application&quot; to attempt recovery.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                        2
                      </span>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Clear browser cache</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Hard refresh (Ctrl+F5 or Cmd+Shift+R) or clear browser cache.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                        3
                      </span>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Contact support</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        If the problem persists, please contact the development team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Thailand-Cambodia Conflict Monitor • Global Application Error
              </p>
              {error.digest && (
                <p className="text-xs text-gray-400 mt-1">
                  Error ID: {error.digest}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Time: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}