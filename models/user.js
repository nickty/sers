const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const crypto = require('crypto')

require('dotenv/config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        maxlength : [30, 'Product name cannot axceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter product email'],
        unique: true,
        validator: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter product password'],
        minlength: [6, 'Your Password must be longer than 6 characters'], 
        select: false
    }, 
    // avatar: {
    //     public_id: {
    //         type: String,
    //         required: true
    //     },
    //     url: {
    //         type: String,
    //         required: true
    //     }
    // }, 
    // role : {
    //     type: String,
    //     default: 'user'
    // }, 
    createAt: {
        type: Date,
        default: Date.now()
    },
    // resetPasswordToken: String,
    // resetPasswordExpire: Date
})


//Entrypting password before saving 
userSchema.pre('save', async function (next){
    if(!this.isDirectModified('password')){
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// Return JWT token 
userSchema.methods.getJwtToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_TIME})
}

//Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//Generate password reset token
// userSchema.methods.getResetPasswordToken = function(){
//     //Generate token
//     const resetToken = crypto.randomBytes(20).toString('hex')

//     //Has and set to resetPasswordToken
//     this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

//     //Set token expire time
//     this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

//     return resetToken
// }
 
module.exports = mongoose.model('User', userSchema)