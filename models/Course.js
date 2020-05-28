const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'please add a course title']
    },
    description: {
        type: String,
        required: [true, 'please add a course description']
    },
    weeks: {
        type: String,
        required: [true, 'please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scolarshipAvailable: {
        type: String,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
})
//-------important--------
//static method. Are called directly on the model.
// Course.testMethod()
//methods. called on a model query. create a variable and assign to it the model query.
//method is then run on the model query variable.
// const course = Course.testMethod()
// course.testMethods()

//static method to get avg course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    // console.log('calculate avg cost'.blue)

    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ])

    // console.log('avg obj: ', obj)
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        })
    } catch (error) {
        console.log('error in add averageCost to DB: ', error)
    }
}

//call method averageCost after Save. 
//this.bootcamp refers to the field bootcamp in the schema, created after save
CourseSchema.post('save', async function () {
    await this.constructor.getAverageCost(this.bootcamp)
})

//call method averageCost before Remove
CourseSchema.pre('remove', async function () {
    await this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course', CourseSchema)