// // require('dotenv').config()

// const express = require('express')
// // const jwt = require('jsonwebtoken')
// const orchestraRoutes = require('./src/orchestra/routes')
// const orchestraMemberRoutes = require('./src/orchestra_member/routes')

// const app = express()
// const port = 3000

// // Increase the size limit for the JSON payload
// app.use(express.json({ limit: '100mb' }))
// app.use(express.urlencoded({ limit: '100mb', extended: true })) // Increase the limit for URL-encoded payloads

// app.get('/', (req, res) => {
//     res.send('Home')
// })

// app.use('/api/orchestra', orchestraRoutes)
// app.use('/api/orchestraMember', orchestraMemberRoutes)

// app.listen(port, () => console.log(`app listening on port ${port}`))

require('dotenv').config()

const express = require('express')
const authRoutes = require('./src/routes/authRoutes')
const orchestraRoutes = require('./src/routes/orchestraRoutes')

const app = express()
const PORT = process.env.PORT || 3000

// app.use(express.json())
// Increase the size limit for the JSON payload
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true })) // Increase the limit for URL-encoded payloads

app.use('/auth', authRoutes)
app.use('/orchestra', orchestraRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// TODO: 7. Role Handling for Multiple Roles (Player, Manager, Owner)
// TODO: 8. Modify Middleware to Check Role per Orchestra
