// Bring Exrpess
const express = require('express')
const router = express.Router()
const find = require('find-process')
const activeWindow = require('active-win')
const { ensureAuthenticated } = require('../config/auth')
const os = require('os')
const {
    hasScreenCapturePermission,
    hasPromptedForPermission,
} = require('mac-screen-capture-permissions')
const screenshot = require('screenshot-desktop')
const prettyBytes = require('pretty-bytes')
const date = require('date-and-time')
const pgdb = require('../models/index')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const moment = require('moment')

var admin = require('firebase-admin')
var serviceAccount = require('./evencloud-26d32-firebase-adminsdk-k1gm0-0ea627d59e.json')
const { async } = require('@firebase/util')

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://evencloud-26d32.firebaseio.com',
    storageBucket: 'evencloud-26d32.appspot.com',
})

var db = admin.database()
let storage = admin.storage().bucket()

const dbRef = db.ref(`tracker/testuser1234`)

let arrApps = []
let namesApps = []
var obj = {}

var imgArr = [
    {
        id: 1,
        name: 'Brave-browser',
        image: 'https://img.icons8.com/color/28/000000/brave-web-browser.png',
    },
    {
        id: 2,
        name: 'Slack',
        image: 'https://img.icons8.com/color/28/000000/slack-new.png',
    },
    {
        id: 3,
        name: 'Code',
        image: 'https://img.icons8.com/color/28/000000/visual-studio-code-2019.png',
    },
    {
        id: 4,
        name: 'Firefox',
        image: 'https://img.icons8.com/color/28/000000/fox.png',
    },
]

function checkOS() {
    // Printing os.type() value
    var type = os.type()
    switch (type) {
        case 'Darwin':
            if (!hasScreenCapturePermission()) {
                hasPromptedForPermission()
            }
            break
        case 'Linux':
            console.log('Linux operating system')
            break
        case 'Windows_NT':
            console.log('windows operating system')
            break
        default:
            console.log('other operating system')
    }
}

const upload = async (imgBytes, name) => {
    const options = {
        resumable: false,
        metadata: { contentType: 'image/png' },
    }
    const file = storage.file(`trackerData/desktop_app/${name}`)
    const imageBuffer = Buffer.from(imgBytes, 'base64')
    const imageByteArray = new Uint8Array(imageBuffer)

    return file
        .save(imageByteArray, options)
        .then(() => {
            return file.getSignedUrl({
                action: 'read',
                expires: '03-09-2500',
            })
        })
        .then((urls) => {
            const url = urls[0]
            console.log(`\nImage url = ${url}\n`)
            return url
        })
        .catch((err) => {
            console.log(`Unable to upload image ${err}`)
        })
}

const takeSC = async (title) => {
    let name = title + Date.now()
    const img = await screenshot({ format: 'png' })

    const url = await upload(img, name)
    return url
}

async function getURL() {}

/**
 @  Rendering the pages
 */
// Login Page
router.get('/', async (req, res) => {
    // fs.readFile('userId', 'utf-8', (err, data) => {
    //     if (err) {
    //         res.render('login')
    //     }

    //     if (data) {
    //         req.body.id = data
    //         res.render('login', { id: data })
    //     }
    // })

    fs.readFile('applicationId', 'utf-8', async (err, id) => {
        if (err) {
            res.render('login')
        }
        if (id) {
            const applicationId = id
            console.log('\n', '\n', applicationId)
            await pgdb.application_ids
                .findByPk(applicationId)
                .then((data) => {
                    if (data) {
                        console.log('**************')
                        console.log(data.dataValues.userId)
                        console.log('**************')
                        req.body.id = data.dataValues.userId
                        res.render('login', { id: data.dataValues.userId })
                    } else {
                        res.render('login')
                    }
                })
                .catch((err) => console.log(err.message))
        }
    })

    checkOS()
    getURL()
})

// Login Page
router.get('/home', ensureAuthenticated, async (req, res) => {
    var type = os.type()
    let memory = ''
    let appImage = null
    let icon = ''
    let imgName = []
    const now = new Date()

    try {
        let appsOpen = await activeWindow(true)

        find('port', 3002).then(function (list) {
            if (!list.length) {
                console.log('port 80 is free now')
            } else {
                console.log('%s is listening port 80', list[0].name)
            }
        })

        memory = prettyBytes(appsOpen.memoryUsage)

        appImage = imgArr.filter((apps) => appsOpen.owner.name === apps.name)
        if (appImage.length === 0) {
            icon =
                'https://img.icons8.com/color/28/000000/application-window.png'
        } else {
            icon = appImage[0].image
        }

        if (!namesApps.includes(appsOpen.owner.name)) {
            namesApps.push(appsOpen.owner.name)
        }

        const val = await pgdb.screenshot_setting.findOne({
            organization: req.user.organization,
        })

        const dataValues = val?.dataValues

        arrApps.map((app) => {
            namesApps.map((app2) => {
                if (app.owner === app2) {
                    let oldtime = app.time
                    console.log(oldtime)
                    obj = {
                        apptitle: appsOpen.title,
                        platform: type,
                        owner: appsOpen.owner.name,
                        time: oldtime + 8,
                        memory,
                        icon,
                        imgName,
                    }
                } else {
                    obj = {
                        apptitle: appsOpen.title,
                        platform: type,
                        owner: appsOpen.owner.name,
                        time: 0,
                        memory,
                        icon,
                        imgName,
                    }
                }
            })
        })

        if (Object.keys(obj).length === 0) {
            obj = {
                apptitle: appsOpen.title,
                platform: type,
                owner: appsOpen.owner.name,
                time: 0,
                memory,
                icon,
                imgName,
            }
        }

        if (obj.time === 16 || obj.time === 32) {
            let url = ''

            var currTime = moment()
            var startTime = moment(dataValues.takeTime.startTime)
            var endTime = moment(dataValues.takeTime.endTime)

            if (
                currTime.isBetween(startTime, endTime) &&
                dataValues.teams.includes(req.user.team)
            ) {
                url = await takeSC(appsOpen.title)
            } else {
                console.log('Not Between')
            }

            if (url !== '') {
                obj.imgName.push(url)
            }

            require('dns').resolve('www.google.com', function (err) {
                if (err) {
                    var newObj = {
                        username: 'Test User',
                        work: obj,
                    }
                    // var jsonObj = JSON.parse(newObj);
                    var jsonContent = JSON.stringify(newObj)
                    fs.writeFile(
                        'offlineoutput.json',
                        jsonContent,
                        'utf8',
                        function (error) {
                            if (error) {
                                console.log(
                                    'An error occured while writing JSON Object to File.'
                                )
                                return console.log(error)
                            }
                            console.log('JSON file has been saved.')
                        }
                    )
                } else {
                    dbRef.set({
                        username: 'Test User',
                        work: obj,
                    })
                }
            })

            if (arrApps.length === 0) {
                arrApps.push(obj)
            } else {
                let index = arrApps.findIndex(
                    (x) => x.owner === appsOpen.owner.name
                )
                if (index > -1) {
                    arrApps.splice(index, 1)
                }
                arrApps.push(obj)
            }

            console.log('data  :: ', obj)

            // timescale db
            const data = {
                id: uuidv4(),
                userid: req.user.id,
                organization: req.user.organization,
                team: req.user.team,
                apptitle: obj.apptitle,
                platform: obj.platform,
                owner: obj.owner,
                duration: obj.time,
                type: 'Idle',
                memory: obj.memory,
                icon: obj.icon,
                imgName: obj.imgName,
                time: new Date(),
            }

            await pgdb.tracker_data
                .create(data)
                .then(() => console.log('Data Added To DB'))
                .catch((error) => console.log(error.message))

            res.render('home', {
                name: req.user.fullName,
                arrApps,
                todayDate: date.format(now, 'ddd, MMM DD YYY'),
            })
        } else {
            require('dns').resolve('www.google.com', function (err) {
                if (err) {
                    var newObj = {
                        username: 'Test User',
                        work: obj,
                    }
                    // var jsonObj = JSON.parse(newObj);
                    var jsonContent = JSON.stringify(newObj)
                    fs.writeFile(
                        'offlineoutput.json',
                        jsonContent,
                        'utf8',
                        function (err) {
                            if (err) {
                                console.log(
                                    'An error occured while writing JSON Object to File.'
                                )
                                return console.log(err)
                            }
                            console.log('JSON file has been saved.')
                        }
                    )
                } else {
                    dbRef.set({
                        username: 'Test User',
                        work: obj,
                    })
                }
            })

            if (arrApps.length === 0) {
                arrApps.push(obj)
            } else {
                let index = arrApps.findIndex(
                    (x) => x.owner === appsOpen.owner.name
                )
                if (index > -1) {
                    arrApps.splice(index, 1)
                }
                arrApps.push(obj)
            }

            // timescale db
            const data = {
                id: uuidv4(),
                userid: req.user.id,
                organization: req.user.organization,
                team: req.user.team,
                apptitle: obj.apptitle,
                platform: obj.platform,
                owner: obj.owner,
                duration: obj.time,
                type: 'Idle',
                memory: obj.memory,
                icon: obj.icon,
                imgName: obj.imgName,
                time: new Date(),
            }

            console.log('data  :: ', data)

            await pgdb.tracker_data
                .create(data)
                .then(() => console.log('Data Added To DB'))
                .catch((error) => console.log(error))

            res.render('home', {
                name: req.user.fullName,
                arrApps,
                todayDate: date.format(now, 'ddd, MMM DD YYY'),
            })
        }
    } catch (error) {
        console.error(error)
    }
})

module.exports = router
