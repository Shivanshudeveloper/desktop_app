const express = require('express')
const db = require('../models/index')
const passport = require('passport')

require('dotenv').config()

const router = express.Router()

router.post(
    '/login',
    passport.authenticate('verify-id', {
        failureRedirect: '/',
        failureFlash: true,
    }),
    (req, res) => {
        res.redirect('/home')
    }
)

router.get('/teamUsers/:organization', async (req, res, next) => {
    try {
        const { organization } = req.params

        const data = await db.team_user.findAll({
            where: { organization, visibility: true },
        })

        res.send([data])
    } catch (error) {
        next(error)
    }
})

module.exports = router
