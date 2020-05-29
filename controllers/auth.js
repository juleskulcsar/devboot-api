
const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
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

//@desc log user out/clear cookie
//@route GRT /api/v1/auth/logout
//@access private
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expres: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}
    })
})

//@desc get current user
//@route POST /api/v1/auth/me
//@access public
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})

//@desc update user details
//@route PUT /api/v1/auth/updatedetails
//@access private
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })
})

//@desc update pass
//@route PUT /api/v1/auth/updatepassword
//@access public
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    //check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        next(new ErrorResponse('password is incorrect'), 401)
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res)

    res.status(200).json({
        success: true,
        data: user
    })
})

//@desc forgot pass
//@route POST /api/v1/auth/forgotpassword
//@access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        next(new ErrorResponse("No user with that email"), 404)
    }

    //get reset token
    const resetToken = user.getResetPasswordToken()
    console.log("reset Token is: ", resetToken)

    await user.save({ validateBeforeSave: false })

    //create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

    const message = `You are receiving this email because you (or someone else) requested the reset of a password. 
    Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message: message
        })

        res.status(200).json({
            success: true,
            data: 'email sent'
        })
    } catch (error) {
        console.log(error);
        user.getResetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorResponse('email could not be sent'), 500)
    }

    res.status(200).json({
        success: true,
        data: user
    })
})


//@desc reset pass
//@route PUT /api/v1/auth/restpassword/:resettoken
//@access public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    //get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorResponse('invalid token'), 400)
    }

    //set new pass
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res)

    res.status(200).json({
        success: true,
        data: user
    })
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