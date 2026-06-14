import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">🔒</span>
          </div>
          <span className="text-xl font-bold text-gray-900">URLSafe</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</a>
          <a href="#docs" className="text-gray-600 hover:text-gray-900 transition">Docs</a>
          <Link to="/checkout" className="btn-primary">Get Started</Link>
        </div>

        <button 
          className="md:hidden text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-6 py-4 flex flex-col gap-4">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="#docs" className="text-gray-600 hover:text-gray-900">Docs</a>
            <Link to="/checkout" className="btn-primary">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
