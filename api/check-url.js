import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function verifyApiKey(apiKey) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('api_key', apiKey)
    .single()

  if (error || !data) {
    return null
  }

  if (data.subscription_status !== 'active') {
    return null
  }

  return data
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = req.headers['x-api-key']

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' })
  }

  const user = await verifyApiKey(apiKey)

  if (!user) {
    return res.status(401).json({ error: 'Invalid or inactive API key' })
  }

  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  try {
    // Placeholder URL checking logic
    const isSafe = Math.random() > 0.2
    
    res.status(200).json({
      url,
      safe: isSafe,
      threat_level: isSafe ? 'none' : 'high',
      trust_score: isSafe ? 95 : 15,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('URL check error:', error)
    res.status(500).json({ error: 'Failed to check URL' })
  }
}
