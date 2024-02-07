const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        allowedValues: ['Admin', 'User']
    },

    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]
})





userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password + "23945", 12)
    }
    next();
})


userSchema.methods.generateAuthToken = async function (next) {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
        next()
    } catch (error) {
        console.log(error)
    }
}

const User = mongoose.model('User_Registeration', userSchema);


module.exports = User;