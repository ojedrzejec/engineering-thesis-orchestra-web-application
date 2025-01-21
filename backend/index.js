require('dotenv').config()

const express = require('express')
const cors = require('cors')
const authRoutes = require('./src/routes/authRoutes')
const orchestraMemberRoutes = require('./src/routes/orchestraMemberRoutes')
const orchestraRoutes = require('./src/routes/orchestraRoutes')
const orchestraOrchestraMemberRoutes = require('./src/routes/orchestraOrchestraMemberRoutes')
const instrumentRoutes = require('./src/routes/instrumentRoutes')
const groupRoutes = require('./src/routes/groupRoutes')
const concertRoutes = require('./src/routes/concertRoutes')
const repertoireRoutes = require('./src/routes/repertoireRoutes')

const app = express()

const corsOptions = {
    origin: process.env.CORS_ORIGIN, // frontend domain
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))

const PORT = process.env.PORT || 3000

app.use(express.json({ limit: '100mb' })) // Increase the size limit for the JSON payload
app.use(express.urlencoded({ limit: '100mb', extended: true })) // Increase the limit for URL-encoded payloads

app.use('/auth', authRoutes)
app.use('/orchestra-member', orchestraMemberRoutes)
app.use('/orchestra', orchestraRoutes)
app.use('/orchestra-orchestra-member', orchestraOrchestraMemberRoutes)
app.use('/instrument', instrumentRoutes)
app.use('/group', groupRoutes)
app.use('/concert', concertRoutes)
app.use('/repertoire', repertoireRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
