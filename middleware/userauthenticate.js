const jwt = require('jsonwebtoken');
const Farmer = require('../model/UserReg');

const userauthenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        const rootUser = await Farmer.findOne({ _id: verifyToken._id });

        if (!rootUser) { throw new Error('User not found') }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
    } catch (error) {
        res.status(401).send("Unauthorized: No token provided")
        console.log(error)
    }
}

module.exports = userauthenticate;