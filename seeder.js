const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//lad env variables
dotenv.config({ path: './config/config.env' })

//load models
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const User = require('./models/User')
const Review = require('./models/Review')

//connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

//read JSON file
const bootcamp = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const course = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))
const user = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))
const review = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'))

//import in db
const importData = async () => {
    try {
        await Bootcamp.create(bootcamp)
        await Course.create(course)
        await User.create(user)
        await Review.create(review)
        console.log('data imported in db'.green.inverse)
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

//delete the data from db
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('data deleted from db'.red.inverse)
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

if (process.argv[2] === '-i') {
    importData()
} else if (process.argv[2] === '-d') {
    deleteData()
}

//-------RUN THESE COMMANDS IN node-------
//node seeder -i => to import data
//node seeder -d => to delete data