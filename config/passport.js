const CustomStrategy = require('passport-custom').Strategy
const db = require('../models/index')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

module.exports = (passport) => {
    passport.use(
        'verify-id',
        new CustomStrategy(async (req, done) => {
            try {
                const { id } = req.body
                const user = await db.team_users.findByPk(id)
                if (!user) {
                    return done(null, false, {
                        message: 'This user id does not exist',
                    })
                } else {
                    var applicationId
                    fs.readFile('applicationId', 'utf-8', (err, data) => {
                        if (err) {
                            applicationId = uuidv4()
                        }
                        if (data) {
                            applicationId = data
                        }
                    })

                    if (!applicationId) {
                        applicationId = uuidv4()
                    }

                    await db.application_ids
                        .findByPk(applicationId)
                        .then(async (exist) => {
                            if (!exist) {
                                await db.application_ids
                                    .create({
                                        id: applicationId,
                                        userId: id,
                                        organization: user.organization,
                                        applicationid: applicationId,
                                        time: new Date().getTime(),
                                    })
                                    .catch((err) => {
                                        console.log(err.message)
                                    })
                            }
                        })
                        .catch((err) => console.log(err.message))

                    fs.writeFileSync('userId', user.id)
                    fs.writeFileSync('applicationId', applicationId)
                    return done(null, user)
                }
            } catch (error) {
                console.log(error)
                done(null, false, { message: 'Incorrect User Id.' })
            }
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        db.team_users
            .findByPk(id)
            .then((user) => {
                done(null, user.dataValues)
            })
            .catch((err) => done(err, null))
    })
}
