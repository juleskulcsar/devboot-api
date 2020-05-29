const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {

    let error = { ...err }
    error.message = err.message

    //log to console
    // console.log(err.stack.red)
    console.log(err)

    //mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `resource does not exist`;
        error = new ErrorResponse(message, 404)
    }

    //mongoose duplicate id
    if (err.code === 1100) {
        const message = 'Duplicate field value';
        error = new ErrorResponse(message, 400)
    }

    //mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message)
        // console.log('error message array: ', message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    })
}

module.exports = errorHandler