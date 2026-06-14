import React from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Know if a URL is <span className="text-blue-600">Safe or Dangerous</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Protect your users with URLSafe. Our API instantly checks if URLs are malicious, phishing links, or safe to visit. Real-time threat detection powered by advanced security analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/checkout" className="btn-primary text-center">
                Start Free Trial
              </Link>
              <button className="btn-secondary text-center">
                Watch Demo
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              ✓ No credit card required • ✓ 100 free checks • ✓ 99.9% uptime SLA
            </p>
          </div>
          
          <div className="hero-visual">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg blur-3xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 border border-blue-200">
                <div className="space-y-4">
                  <div className="bg-white rounded p-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">URL Input</p>
                    <p className="font-mono text-sm text-blue-600">https://example.com</p>
                  </div>
                  <div className="flex justify-center text-3xl">⚡</div>
                  <div className="bg-white rounded p-4 border border-green-200 bg-green-50">
                    <p className="text-sm text-gray-600 mb-2">Status: SAFE ✓</p>
                    <p className="text-xs text-green-600">Trust Score: 98%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
