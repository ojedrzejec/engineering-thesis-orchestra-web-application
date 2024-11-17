require('dotenv').config()

const express = require('express')
const cors = require('cors')
const authRoutes = require('./src/routes/authRoutes')
const orchestraMemberRoutes = require('./src/routes/orchestraMemberRoutes')
const orchestraRoutes = require('./src/routes/orchestraRoutes')
const orchestraOrchestraMemberRoutes = require('./src/routes/orchestraOrchestraMemberRoutes')
const instrumentRoutes = require('./src/routes/instrumentRoutes')

const app = express()

app.use(cors())
// app.use(
//     cors({
//         origin: process.env.CORS_ORIGIN,
//     })
// )

const PORT = process.env.PORT || 3000

// app.use(express.json())
// Increase the size limit for the JSON payload
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true })) // Increase the limit for URL-encoded payloads

app.use('/auth', authRoutes)
app.use('/orchestraMember', orchestraMemberRoutes)
app.use('/orchestra', orchestraRoutes)
app.use('/orchestra-orchestra-member', orchestraOrchestraMemberRoutes)
app.use('/instrument', instrumentRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
