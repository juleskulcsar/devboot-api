const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {

    let error = { ...err }
    error.message = err.message

    //log to console
    console.log(err.stack.red)

    //mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `bootcamp with id ${err.value} does not exists`;
        error = new ErrorResponse(message, 404)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    })
}

module.exports = errorHandler