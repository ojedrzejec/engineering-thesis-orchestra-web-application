// require('dotenv').config()

const express = require('express')
// const jwt = require('jsonwebtoken')
const orchestraRoutes = require('./src/orchestra/routes')
const orchestraMemberRoutes = require('./src/orchestra_member/routes')

const app = express()
const port = 3000

// Increase the size limit for the JSON payload
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true })) // Increase the limit for URL-encoded payloads

app.get('/', (req, res) => {
    res.send('Home')
})

app.use('/api/orchestra', orchestraRoutes)
app.use('/api/orchestraMember', orchestraMemberRoutes)

// app.use('/login', login_registerRoutes)
// app.use('/register', login_registerRoutes)

// app.post('/login', (req, res) => {
//     res.send('Login')
//     const { email } = req.body
//     const user = { email: email }

//     if (!process.env.ACCESS_TOKEN_SECRET) {
//         return res.status(500).send('ACCESS_TOKEN_SECRET is not defined')
//     }

//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
//     res.json({ accessToken: accessToken })
// })

// app.post('/register', async (req, res) => {
//     res.send('Register')
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10)
//         app.use(
//             '/api/orchestraMember',
//             orchestraMemberRoutes.post(
//                 '/register',
//                 controller.addOrchestraMember
//             )
//         )
//         res.status(201).send()
//     } catch {
//         res.status(500).send()
//     }
// })

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token == null) return res.sendStatus(401)

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403)
//         req.user = user
//         next()
//     })
//     console.log('Access Token Secret:', process.env.ACCESS_TOKEN_SECRET)
// }

app.listen(port, () => console.log(`app listening on port ${port}`))
