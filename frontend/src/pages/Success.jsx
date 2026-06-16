import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const API_URL = (import.meta.env.VITE_API_URL || '/_/backend').replace(/\/$/, '')

function Success() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(Boolean(sessionId))
  const [error, setError] = useState('')
  const [customerAccess, setCustomerAccess] = useState(null)

  useEffect(() => {
    if (!sessionId) {
      setError('Missing Stripe checkout session.')
      setLoading(false)
      return
    }

    async function loadApiKey() {
      try {
        const response = await fetch(`${API_URL}/checkout-session/${sessionId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Unable to confirm payment')
        }

        setCustomerAccess(data)
      } catch (err) {
        console.error('Success page error:', err)
        setError(err.message || 'Payment confirmed, but the API key could not be loaded. Please contact support.')
      } finally {
        setLoading(false)
      }
    }

    loadApiKey()
  }, [sessionId])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
            OK
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment successful
          </h1>

          {loading && (
            <p className="text-gray-600 mb-8">
              Confirming your payment and creating your API key...
            </p>
          )}

          {!loading && error && (
            <p className="text-red-600 mb-8">
              {error}
            </p>
          )}

          {!loading && customerAccess && (
            <>
              <p className="text-gray-600 mb-6">
                Your payment was accepted. Here is your API key:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-semibold text-gray-500 mb-2">API key</p>
                <code className="block text-sm text-gray-900 break-all">
                  {customerAccess.apiKey}
                </code>
              </div>
              <p className="text-sm text-gray-500 mb-8">
                Keep this key private. Use it in the <code>x-api-key</code> header when calling the API.
              </p>
            </>
          )}

          <Link to="/" className="btn-primary inline-block">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Success
