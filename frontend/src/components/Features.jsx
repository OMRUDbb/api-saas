import React from 'react'

const features = [
  {
    icon: '🚀',
    title: 'Real-Time Detection',
    description: 'Instantly analyze URLs and get results in milliseconds with our advanced threat detection engine.'
  },
  {
    icon: '🛡️',
    title: 'Multiple Threat Categories',
    description: 'Detects malware, phishing, spam, ransomware, suspicious behavior, and more.'
  },
  {
    icon: '📊',
    title: 'Detailed Reports',
    description: 'Get comprehensive threat analysis with trust scores and detailed threat information.'
  },
  {
    icon: '⚙️',
    title: 'Easy Integration',
    description: 'RESTful API that integrates seamlessly with your existing applications in minutes.'
  },
  {
    icon: '📈',
    title: 'Scalable Infrastructure',
    description: 'Handle millions of requests per day with our enterprise-grade infrastructure.'
  },
  {
    icon: '🔐',
    title: 'Enterprise Security',
    description: 'Bank-level encryption, GDPR compliant, and SOC2 certified for enterprise peace of mind.'
  }
]

function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to protect your users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
