// Bring Exrpess
const express = require('express');
const router = express.Router();
const activeWindow = require('active-win');
const os = require('os');
const {
    hasScreenCapturePermission,
    hasPromptedForPermission
  } = require('mac-screen-capture-permissions');
const screenshot = require('screenshot-desktop');
const prettyBytes = require('pretty-bytes');
const date = require('date-and-time');


var admin = require("firebase-admin");
var serviceAccount = require("./evencloud-26d32-firebase-adminsdk-k1gm0-0ea627d59e.json");
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://evencloud-26d32.firebaseio.com"
});

var db = admin.database();
const ref = db.ref(`tracker/testuser1234`);





let arrApps = [];
let namesApps = [];
var obj = {}



var imgArr = [
    {
        id: 1,
        name: "Brave-browser",
        image: "https://img.icons8.com/color/28/000000/brave-web-browser.png"
    },
    {
        id: 2,
        name: "Slack",
        image: "https://img.icons8.com/color/28/000000/slack-new.png"
    },
    {
        id: 3,
        name: "Code",
        image: "https://img.icons8.com/color/28/000000/visual-studio-code-2019.png"
    },
    {
        id: 4,
        name: "Firefox",
        image: "https://img.icons8.com/color/28/000000/fox.png"
    }
]

function checkOS() {
    // Printing os.type() value
    var type = os.type();
    switch(type) {
        case 'Darwin':
            if (!hasScreenCapturePermission()) {
                hasPromptedForPermission();
            }
            break;
        case 'Linux': 
            console.log("Linux operating system");
            break;
        case 'Windows_NT':
            console.log("windows operating system");
            break;    
        default: 
            console.log("other operating system");
    }
}

function takeSC(title) {
    var name = title + Date.now();
    screenshot({format: 'png'}).then((img) => {
        require("fs").writeFile(`public/screenshots/${name}.png`, img, 'base64', function(err) {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    })

    return name;
}


function getURL() {
    
}


/**
 @  Rendering the pages
 */
// Login Page
router.get('/', (req, res) => {
    res.render('login');
    checkOS();
    getURL();
});


// Login Page
router.get('/home', async (req, res) => {
    var type = os.type();
    let memory = '';
    let appImage = null;
    let icon = '';
    let imgName = [];
    const now = new Date();

    try {
        let appsOpen = await activeWindow(true);
        
        memory = prettyBytes(appsOpen.memoryUsage)


        appImage = imgArr.filter((apps) => appsOpen.owner.name === apps.name);
        if (appImage.length === 0) {
            icon = "https://img.icons8.com/color/28/000000/application-window.png";
        } else {
            icon = appImage[0].image;
        }

        if (!namesApps.includes(appsOpen.owner.name)) {
            namesApps.push(appsOpen.owner.name);
        }

        


        arrApps.map((app) => {
            namesApps.map((app2) => {
                if (app.owner === app2) {
                    let oldtime = app.time;
                    console.log(oldtime);
                    obj = {
                        apptitle: appsOpen.title,
                        platform: type,
                        owner: appsOpen.owner.name,
                        time: oldtime + 8,
                        memory,
                        icon,
                        imgName
                    }
                } else {
                    obj = {
                        apptitle: appsOpen.title,
                        platform: type,
                        owner: appsOpen.owner.name,
                        time: 0,
                        memory,
                        icon,
                        imgName
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
                imgName
            }
        }

        

        if (obj.time === 16 || obj.time === 32) {
            (obj.imgName).push(takeSC(appsOpen.title) + '.png');
        }

        ref.set({
            username: 'Test User',
            work: obj
        })

        

        if (arrApps.length === 0) {
            arrApps.push(obj);
        } else {
            let index = arrApps.findIndex(x => x.owner === appsOpen.owner.name);
            if (index > -1) {
                arrApps.splice(index, 1);
            }
            arrApps.push(obj);
        }



        res.render('home', {
            arrApps,
            todayDate: date.format(now, 'ddd, MMM DD YYYY')
        });
    } catch (error) {
        console.error(error);
    }
    
});



module.exports = router;