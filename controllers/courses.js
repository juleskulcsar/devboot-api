const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//@desc Get all courses
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcampId/courses
//@access public
// exports.getCourses = asyncHandler(async (req, res, next) => {
//     let query;
//     if (req.params.bootcampId) {
//         query = Course.find({ bootcamp: req.params.bootcampId })
//     } else {
//         query = Course.find().populate({
//             path: 'bootcamp',
//             select: 'name description'
//         })
//     }

//     const courses = await query;

//     res.status(200).json({
//         succes: true,
//         count: courses.length,
//         data: courses
//     })
// })

//adding advancedResults middleware
exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = Course.find({ bootcamp: req.params.bootcampId })

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResults)
    }
})

//@desc Get one course
//@route GET /api/v1/courses/:id
//@access public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: ['name', 'description']
    })

    if (!course) {
        return next(new ErrorResponse(`no course with the id ${req.params.id}`), 400)
    }

    res.status(200).json({
        succes: true,
        data: course
    })
})

//@desc Add course
//@route POST /api/v1/bootcamps/:bootcampId/courses
//@access private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`no bootcamp with the id ${req.params.bootcampId}`), 400)
    }

    //check if user is bootcamp owner.
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`user with id ${req.user.id} not authorized to add a course to this bootcamp`, 401))
    }

    const course = await Course.create(req.body)

    res.status(200).json({
        succes: true,
        data: course
    })
})

//@desc Update course
//@route PUT /api/v1/courses/:id
//@access private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id)

    if (!course) {
        return next(new ErrorResponse(`no course with the id ${req.params.id} found`), 400)
    }

    //check if user is bootcamp owner.
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`user with id ${req.user.id} not authorized to update a course to this bootcamp`, 401))
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        bew: true,
        runValidators: true
    })

    res.status(200).json({
        succes: true,
        data: course
    })
})

//@desc Delete course
//@route DELETE /api/v1/courses/:id
//@access private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id)

    if (!course) {
        return next(new ErrorResponse(`no course with the id ${req.params.id} found`), 400)
    }

    //check if user is bootcamp owner.
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`user with id ${req.user.id} not authorized to delete a course to this bootcamp`, 401))
    }

    await course.remove()

    res.status(200).json({
        succes: true,
        data: {}
    })
})

