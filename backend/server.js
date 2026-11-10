import express from 'express'
import cors from 'cors'
import { supabase } from './supabase.js'

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/todos', async (req, res) => {
  const { data, error } = await supabase.from('todos').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.get('/api/health', async (req, res) => {
  const { error } = await supabase.from('todos').select('*', { count: 'exact', head: true })
  if (error) return res.status(500).json({ ok: false, error: error.message })
  res.json({ ok: true, message: 'Supabase connected' })
})

app.listen(process.env.PORT, () =>
  console.log(`API running on port ${process.env.PORT}`)
)