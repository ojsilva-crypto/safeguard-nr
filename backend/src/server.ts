
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { router } from './routes'

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use('/api', router)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT ?? 3333

app.listen(PORT, () => {
  console.log(`🚀 SafeGuard NR API rodando em http://localhost:${PORT}`)
})
