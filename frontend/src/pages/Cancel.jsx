import React from 'react'
import { Link } from 'react-router-dom'

function Cancel() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm font-bold">
            ✕
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Canceled
          </h1>
          <p className="text-gray-600 mb-8">
            Your payment was canceled. You can try again whenever you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/checkout" className="btn-primary inline-block">
              Try Again
            </Link>
            <Link to="/" className="btn-secondary inline-block">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cancel
