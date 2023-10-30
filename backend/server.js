require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')

// MongoURI
const uri = process.env.MONGO_URI


// Express App
const app = express()


// Middleware
app.use(express.json())


// ========== ========== ========== TBD ========== ========== ========== 
app.use((req, res, next) => { 
    console.log(req.path, req.method)
    next()
})


// Routes

app.use('/api/user', userRoutes)


// Connect to DB

mongoose.connect(uri)
    .then( () => {
        // Listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to DB, Up & Running on port ' + process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })