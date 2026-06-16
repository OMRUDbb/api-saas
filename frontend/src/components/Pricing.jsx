import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { redirectToCheckout } from '../lib/stripeCheckout'

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for small projects',
    features: [
      '10,000 API calls/month',
      'Email support',
      'Basic analytics',
      'REST API access',
      '99.5% uptime SLA'
    ],
    highlighted: false,
    planKey: 'starter'
  },
  {
    name: 'Professional',
    price: '$99',
    period: '/month',
    description: 'For growing businesses',
    features: [
      '100,000 API calls/month',
      'Priority email & chat support',
      'Advanced analytics',
      'REST API access',
      '99.9% uptime SLA',
      'Custom threat rules',
      'Webhook support'
    ],
    highlighted: true,
    planKey: 'entrepreneur'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'Unlimited possibilities',
    features: [
      'Unlimited API calls',
      '24/7 dedicated support',
      'Custom analytics & reports',
      'REST + GraphQL API',
      '99.99% uptime SLA',
      'Custom threat intelligence',
      'On-premise option',
      'SSO & advanced security'
    ],
    highlighted: false,
    planKey: null
  }
]

function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleGetStarted = async (plan) => {
    setLoadingPlan(plan.planKey)
    setErrorMessage('')

    try {
      await redirectToCheckout({ plan: plan.planKey })
    } catch (error) {
      console.error('Checkout error:', error)
      setErrorMessage(error.message || 'Unable to start checkout. Please try again.')
      setLoadingPlan(null)
    }
  }

  return (
    <section id="pricing" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Choose the perfect plan for your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-lg p-8 transition-transform hover:scale-105 ${
                plan.highlighted 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-600 shadow-xl scale-105' 
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              
              <div className="mb-8">
                <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ml-2 ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
                  {plan.period}
                </span>
              </div>

              {plan.planKey ? (
                <button
                  type="button"
                  onClick={() => handleGetStarted(plan)}
                  disabled={loadingPlan === plan.planKey}
                  className={`block w-full py-3 px-6 rounded-lg font-semibold text-center mb-8 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loadingPlan === plan.planKey ? 'Redirecting...' : 'Get Started'}
                </button>
              ) : (
                <Link
                  to="/checkout"
                  className={`block w-full py-3 px-6 rounded-lg font-semibold text-center mb-8 transition-colors ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Contact Sales
                </Link>
              )}

              <ul className="space-y-3">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <span className="text-lg">✓</span>
                    <span className={`text-sm ${plan.highlighted ? 'text-blue-50' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          {errorMessage && (
            <p className="text-red-600 mb-4">
              {errorMessage}
            </p>
          )}
          <p className="text-gray-600">
            Not sure which plan? <a href="#" className="text-blue-600 font-semibold hover:underline">Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Pricing
