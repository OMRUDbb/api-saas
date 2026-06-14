import React from 'react'
import { Link } from 'react-router-dom'

function CTA() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 md:py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Secure Your URLs?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of companies that trust URLSafe to protect their users from malicious links and phishing attacks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/checkout" className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition text-center">
            Start Your Free Trial
          </Link>
          <a href="#" className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition text-center">
            Schedule Demo
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTA
