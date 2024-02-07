const express = require('express');
const app = express()
const router = express.Router();
require("../db/conn");
const Email = require('../model/email');
const Users = require('../model/UserReg');
const Drive = require('../model/drives');
const RegDrive = require('../model/register');
const bcrypt = require('bcryptjs')
const cors = require("cors");
const userauthenticate = require('../middleware/userauthenticate');
const cookieParser = require('cookie-parser');
app.use(cors());
app.use(cookieParser())
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
//<------------------------------------------------------------------------------------------------------------------------------------------------------------------------->


// Consumer routes
router.post('/user-signup', async (req, res) => {
    const { name, age, gender, email, password, phonenumber, city } = req.body;
    console.log(req.body)
    // Checking if any field is blank
    if (!name || !age || !gender || !email || !password || !phonenumber || !city) {
        console.log("Cannot cannot retrieve data as field is/ are blank")
        return res.status(422).json({ error: "None of the fields can be blank" });
    }

    try {
        // Checking if a user with an email already exists
        const userExist = await Users.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "The email Id already exists" });
        }

        // Registering a new user 
        const user = new Users(req.body);

        // Checking that registration successful or failed
        try {
            await user.save();

            res.status(201).json({ message: "User registered successfully" });

        } catch (error) {
            res.status(500).json({ error: "Failed to register user" });
            console.log(error)
        }
    } catch (error) {
        console.log(error);
    }
});

// Post Request: Making a Consumer Login
router.post('/user-signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Checking if any field is blank
        if (!email || !password) {
            console.log("Cannot cannot retrieve data as a feild is blank")
            return res.status(422).json({ error: "None of the feilds can be blank" });
        }

        // Checking if a user with an email  exists
        const userLogin = await Users.findOne({ email: email });
        // console.log(userLogin)

        if (userLogin) {
            const isMatch = await bcrypt.compare(password + "23945", userLogin.password)
            // console.log(isMatch)

            const token = await userLogin.generateAuthToken();
            // console.log(token)

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
            })
            // console.log(isMatch)

            if (!isMatch) {
                res.status(400).json({ error: "Incorrect credential" })
            } else {
                res.json({ message: "Login successful              Your JWT: " + token })
            }
        } else {
            res.status(400).json({ error: "Incorrect credential" })
        }

    } catch (error) {
        console.log(error);
    }
});


// Get Request: Retrieve Farmer Profile Info
router.get('/profile', userauthenticate, (req, res) => {
    res.send(req.rootUser);
})

// Home page send email route
router.post('/sendEmail', userauthenticate, async (req, res) => {
    const { cname, cemail, cmessage } = req.body;
    // Checking if any field is blank
    if (!cname || !cemail || !cmessage) {
        console.log("Cannot retrieve data as a field is blank")
        return res.status(422).json({ error: "None of the fields can be blank" });
    }
    try {

        // Adding a new admission form
        const email = new Email({
            cname, cemail, cmessage, user: req.rootUser._id
        });
        // Checking that adding successful or failed
        try {
            await email.save();

            res.status(201).json({ message: "Message sent successfully" });

        } catch (error) {
            res.status(500).json({ error: "Failed to send message" });
            // console.log(error)
        }
    } catch (error) {
        console.log(error);
    }
})

// Logging out a user
router.get('/logout', (req, res) => {
    console.log("Logout Page");
    res.clearCookie('jwtoken', { path: "/" })
    res.clearCookie('itemid', { path: "/" })
    res.status(200).send("User Logged out")
})



router.post('/drive-register', async (req, res) => {
    const { name, available, lat, long, city, startdate, enddate, des, address } = req.body;
    console.log(req.body)
    // Checking if any field is blank
    if (!name || !available || !lat || !long || !city || !startdate || !enddate || !des || !address) {
        console.log("Cannot cannot retrieve data as field is/ are blank")
        return res.status(422).json({ error: "None of the fields can be blank" });
    }

    try {
        // Checking if a user with an email already exists
        const userExist = await Drive.findOne({ name: name });
        if (userExist) {
            return res.status(422).json({ error: "The drive already exists" });
        }

        // Registering a new user 
        const drive = new Drive(req.body);

        // Checking that registration successful or failed
        try {
            await drive.save();

            res.status(201).json({ message: "Drive registered successfully" });

        } catch (error) {
            res.status(500).json({ error: "Failed to register drive" });
            console.log(error)
        }
    } catch (error) {
        console.log(error);
    }
});
router.get('/cleandrive', userauthenticate, async (req, res) => {
    let cityname = req.rootUser.city
    const Drivename = await Drive.find({ city: cityname });
    res.send(Drivename)
})

router.get('/cleandrivespec', async (req, res) => {
    const findbyid = req.cookies.driveid
    const Drivename = await Drive.find({ _id: findbyid });
    res.send(Drivename)
})


router.post('/registerfordrive', userauthenticate, async (req, res) => {
    console.log(req.rootUser)
    // Checking if any field is blank

    try {
        // Checking if a user with an email already exists

        // Registering a new user 
        const RegDrives = new RegDrive({ firstname: req.rootUser.name, lastname: req.rootUser.name, driveid: req.cookies.driveid, email: req.rootUser.email, age: req.rootUser.age, gender: req.rootUser.gender, city: req.rootUser.city });
        console.log(req.cookies.driveid)
        const Drivenames = await Drive.findOne({ _id: req.cookies.driveid })
        const newavailable = Drivenames.available
        console.log(Drivenames)

        if (newavailable === 0) {
            return res.status(422).json({ error: "The drive full with participants" });
        }
        try {
            const update = await Drive.findByIdAndUpdate({ _id: req.cookies.driveid }, {
                $set: {
                    available: newavailable - 1,
                }
            })
            console.log(update)
            await RegDrives.save();

            res.status(201).json({ message: "Registered successfully" });
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/sendemail', async (req, res) => {
    const { user, cname, cemail, cmessage } = req.body;
    console.log(req.body)
    // Checking if any field is blank
    if (!user || !cname || !cemail || !cmessage) {
        console.log("Cannot cannot retrieve data as field is/ are blank")
        return res.status(422).json({ error: "None of the fields can be blank" });
    }

    try {
        // Adding a new mail 
        const Emails = new Email(req.body);
        try {
            await Emails.save();

            res.status(201).json({ message: "Email sent successfully" });
        } catch (error) {
            console.log("Cannot Send Email")
        }
    } catch (error) {
        console.log(error);
    }
});




module.exports = router;