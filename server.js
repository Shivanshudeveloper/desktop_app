// Express
const express = require('express')
// Express Layouts
const expressLayouts = require('express-ejs-layouts')
// MongoDB
const mongoose = require('mongoose')
// Express Session
const session = require('express-session')
// Path Module
const path = require('path')
// Flash
const flash = require('connect-flash')
// DB config file
const connectDB = require('./config/dbConfig')
//passport
const passport = require('passport')
require('./config/passport')(passport)

const fs = require('fs')

// Initializing app
const app = express()

// connecting to database
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
//connectDB()

// For Static Files
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, '/views/'))

// BodyParser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// EJS Middleware
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Express Session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
// Globar Varivale
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.info = req.flash('info')
    res.locals.success_post = req.flash('success_post')
    next()
})

// Setting Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

// Getting PORT set
const PORT = process.env.PORT || 3002

// Starting the server
app.listen(PORT, console.log('Server Started On Port', PORT))
