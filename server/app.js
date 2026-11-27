import express from 'express'
import cors from 'cors'
import logger from './middleware/logger.js'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middleware/errorHanderl.js'
const app = express()
app.use(express.json())
app.use(logger)
app.use(cors())

// app.get('/api/health', (req, res) => {
//     return res.json(
//         { ok: true }
//     )
// })
app.use('/api', routes)
app.use('/api',notFound)
app.use(errorHandler)
export default app