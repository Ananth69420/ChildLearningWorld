import express from 'express'
const app = express()
app.get('/hello', (_req, res) => res.json({ message: 'Hello from API!' }))
export default app
