
const User = require('../models/user')

//Register a user => /api/v1/register
exports.registerUser =  async (req, res) =>{

    //return console.log("hello");

    // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder: 'avatars',
    //     width: 150,
    //     crop: "scale"
    // })

    const {name, email, password} = req.body

    console.log(name)

    const user = await User.create({
        name, 
        email,
        password, 
        // avatar: {
        //     public_id: result.public_id,
        //     url: result.secure_url
        // }
    })

    //console.log(user)

    const token = user.getJwtToken()

    res.status(201).json({
        success: true, 
        token
    })

    //sendToken(user, 200, res)
}

//Login user => /api/v1/login
exports.loginUser = async (req, res) => {
    const {email, password} = req.body

    //Check if email and password is entered by user 
    // if(!email || !password){
    //     return next(new ErrorHandler('Please enter email and password!', 404))

    // }

    //Find user in database
    const user = await User.findOne({email}).select('+password')

    // if(!user) {
    //     return next(new ErrorHandler('Invalied email or password', 401)) // 401 = un authenticated user
    // }

    //Check if password matched or not 
    console.log(user);

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        //return next(new ErrorHandler('Invalied or password', 401))
        return res.json({"error" : "password is not correct"})
    }

    const token = user.getJwtToken()

    res.status(200).json({
        success: true,
        token,
        user
    })

    //sendToken(user, 200, res)
}