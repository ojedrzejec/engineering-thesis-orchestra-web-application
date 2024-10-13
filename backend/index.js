const express = require('express')
const orchestraRoutes = require('./src/orchestra/routes')
const orchestraMemberRoutes = require('./src/orchestra_member/routes')

const app = express()
const port = 3000

// Increase the size limit for the JSON payload
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: false })) // Increase the limit for URL-encoded payloads

app.get('/', (req, res) => {
    res.send('Home')
})

app.use('/api/orchestra', orchestraRoutes)
app.use('/api/orchestraMember', orchestraMemberRoutes)

app.listen(port, () => console.log(`app listening on port ${port}`))
