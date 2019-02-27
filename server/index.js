require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const massive = require('massive')
const session = require('express-session')

// CONTROLLERS //
const ac = require('./controllers/Auth')


const { CONNECTION_STRING, SERVER_PORT, SESSION_SECRET } = process.env


// MIDDLEWARE
const app = express()

app.use(bodyParser.json());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

massive(CONNECTION_STRING).then((db) => {
    app.set('db', db)
    console.log('db live')
})

//ENDPOINTS
app.post('/auth/signup', ac.signup)
app.post('/auth/login', ac.login)
app.get('/auth/logout', ac.logout)
app.get('/auth/current', ac.current)


app.listen( SERVER_PORT, () => { console.log(`Magic happening on ${SERVER_PORT}`) } )