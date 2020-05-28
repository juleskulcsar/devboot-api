
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

    //create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token: token
    })
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

    //create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token: token
    })
})