
// const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
// const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

//@desc register user
//@route POST /api/v1/auth/register
//@access public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body

    //create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    // //create token
    // const token = user.getSignedJwtToken();

    // res.status(200).json({
    //     success: true,
    //     token: token
    // })
    sendTokenResponse(user, 200, res)
})

//@desc login user
//@route POST /api/v1/auth/register
//@access public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    //validate email and pass
    if (!email || !password) {
        return next(new ErrorResponse('please provide an email and password', 400))
    }

    //check for user
    const user = await User.findOne({ email: email }).select('+password')
    if (!user) {
        return next(new ErrorResponse('please provide a valid email and password', 401))
    }

    //check if password macthes
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return next(new ErrorResponse('please provide a valid email and password', 401))
    }

    // //create token
    // const token = user.getSignedJwtToken();

    // res.status(200).json({
    //     success: true,
    //     token: token
    // })
    sendTokenResponse(user, 200, res)
})

//get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token: token })
}