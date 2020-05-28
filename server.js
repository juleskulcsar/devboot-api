const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')
const errorHandler = require('./middleware/error')
const fileUpload = require('express-fileupload')
const path = require('path')
const cookieParser = require('cookie-parser')

//load env file
dotenv.config({ path: "./config/config.env" })

//connect db
connectDB();

//route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')

const app = express()

//body parser
app.use(express.json())

//cookie parser
app.use(cookieParser())

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//file upload
app.use(fileUpload())

//

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

//mount routers
//we don't have to use "/api/v1/bootcamps" in the routes/bootcamps file
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/bootcamps/:bootcampId/courses', courses)
app.use('/api/v1/auth', auth)

//has to be after mount routes
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Bam Bam in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

//handle promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Err: ${err.message}`.red);
    //close server and exit process
    server.close(() => process.exit(1))
})