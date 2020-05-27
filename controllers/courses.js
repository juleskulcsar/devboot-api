const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//@desc Get all courses
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcampId/courses
//@access public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId })
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        })
    }

    const courses = await query;

    res.status(200).json({
        succes: true,
        count: courses.length,
        data: courses
    })
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

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`no bootcamp with the id ${req.params.bootcampId}`), 400)
    }

    const course = await Course.create(req.body)

    res.status(200).json({
        succes: true,
        data: course
    })
})

