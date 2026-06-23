import React, { useState } from 'react'

const API_URL = (import.meta.env.VITE_API_URL || '/_/backend').replace(/\/$/, '')

function Checkout() {
  const [selectedPlan, setSelectedPlan] = useState('entrepreneur')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')

  const plans = {
    starter: { id: import.meta.env.VITE_STRIPE_PRICE_STARTER || '', name: 'Starter', price: 9.99 },
    professional: { id: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL || '', name: 'Professional', price: 29.99 },
    entrepreneur: { id: import.meta.env.VITE_STRIPE_PRICE_ENTREPRENEUR || '', name: 'Entrepreneur', price: 99.99 }
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plans[selectedPlan].id,
          email,
          fullName,
        }),
      })

      const session = await response.json()
      if (!response.ok) {
        throw new Error(session.error || 'Failed to create checkout session')
      }

      if (session.url) {
        window.location.href = session.url
      } else {
        throw new Error('No checkout URL returned from server')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setErrorMessage(error.message || 'Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            Checkout
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Complete your subscription to start protecting your URLs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plan Selection */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Plan</h2>
              
              <div className="space-y-3 mb-8">
                {Object.entries(plans).map(([key, plan]) => (
                  <label key={key} className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition" 
                    style={{borderColor: selectedPlan === key ? '#2563EB' : '#E5E7EB', backgroundColor: selectedPlan === key ? '#F0F9FF' : 'white'}}>
                    <input
                      type="radio"
                      name="plan"
                      value={key}
                      checked={selectedPlan === key}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">{plan.name}</p>
                      <p className="text-sm text-gray-600">
                        {plan.price === 0 ? 'Custom pricing' : `$${plan.price}/month`}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Selected Plan:</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${plans[selectedPlan].price === 0 ? 'Custom' : plans[selectedPlan].price}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>
              
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${plans[selectedPlan].price === 0 ? 'Custom' : plans[selectedPlan].price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-semibold">Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${plans[selectedPlan].price === 0 ? 'Custom' : plans[selectedPlan].price}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || plans[selectedPlan].price === 0}
                  className="w-full mt-8 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>

                {errorMessage && (
                  <p className="text-sm text-red-600 text-center">
                    {errorMessage}
                  </p>
                )}

                {plans[selectedPlan].price === 0 && (
                  <p className="text-sm text-gray-600 text-center">
                    Contact our sales team for enterprise pricing
                  </p>
                )}

                <p className="text-xs text-gray-500 text-center">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
