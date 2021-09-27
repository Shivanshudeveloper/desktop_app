// Express
const express = require('express');
// Express Layouts
const expressLayouts = require('express-ejs-layouts');
// MongoDB
const mongoose = require('mongoose');
// Express Session
const session = require('express-session');
// Path Module
const path = require('path');
// Flash
const flash = require('connect-flash');

// Initializing app
const app = express();

// For Static Files
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser
app.use(express.urlencoded({ extended: false }) );

// EJS Middleware
app.use(expressLayouts)
app.set('view engine', 'ejs');


// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());
// Globar Varivale
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.info = req.flash('info')
    res.locals.success_post = req.flash('success_post')
    next()
});


// Setting Routes
app.use('/', require('./routes/index'));
// app.use('/users', require('./routes/users'));


// Getting PORT set
const PORT = process.env.PORT || 3001;

// Starting the server
app.listen(PORT, console.log('Server Started On Port', PORT));