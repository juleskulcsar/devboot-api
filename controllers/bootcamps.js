const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access public
// exports.getBootcamps = async (req, res, next) => {
//     // res.json({ name: 'Jules' })
//     //send status
//     //res.sendStatus(400)
//     //send status and json object with success message
//     // res.status(400).json({ success: false })
//     //send status 200 and data
//     // res.status(200).json({ success: true, data: { id: 1 } })
//     // res.status(200).json({ success: true, msg: 'list all bootcamps' })
//     try {
//         const bootcamps = await Bootcamp.find()
//         res.status(200).json({
//             success: true,
//             count: bootcamps.length,
//             data: bootcamps
//         })
//     } catch (error) {
//         // res.status(400).json({
//         //     success: false
//         // })
//         next(error)
//     }
// }

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find()
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})

//@desc Get one bootcamp
//@route GET /api/v1/bootcamps/:id
//@access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`bootcamp with id ${req.params.id} does not exist`, 404))
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    })
})
// exports.getBootcamp = async (req, res, next) => {
//     try {
//         const bootcamp = await Bootcamp.findById(req.params.id);
//         if (!bootcamp) {
//             return next(new ErrorResponse(`bootcamp with id ${req.params.id} does not exists`, 404))
//         }

//         res.status(200).json({
//             success: true,
//             data: bootcamp
//         })
//     } catch (error) {
//         // res.status(400).json({
//         //     success: false
//         // })
//         // next(new ErrorResponse(`bootcamp with id ${req.params.id} does not exist`, 404))
//         next(error)
//     }
//     // res.status(200).json({ success: true, msg: `get bootcamp ${req.params.id}` })
// }

//@desc create bootcamp
//@route POST /api/v1/bootcamps
//@access public
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const newBootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
        success: true,
        data: newBootcamp
    })
})
// exports.createBootcamp = async (req, res, next) => {
//     try {
//         const newBootcamp = await Bootcamp.create(req.body)

//         res.status(201).json({
//             success: true,
//             data: newBootcamp
//         })
//     } catch (error) {
//         // res.status(400).json({
//         //     success: false
//         // })
//         next(error)
//     }
// }

//@desc update bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access public
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!bootcamp) {
        return next(new ErrorResponse(`bootcamp with id ${req.params.id} does not exists`, 404))
    }
    res.status(200).json({
        success: true, data: bootcamp
    })
})
// exports.updateBootcamp = async (req, res, next) => {
//     // res.status(200).json({ success: true, msg: `update bootcamp ${req.params.id}` })
//     try {
//         const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true
//         })

//         if (!bootcamp) {
//             return next(new ErrorResponse(`bootcamp with id ${req.params.id} does not exists`, 404))
//         }

//         res.status(200).json({
//             success: true, data: bootcamp
//         })
//     } catch (error) {
//         // res.status(400).json({
//         //     success: false
//         // })
//         next(error)
//     }
// }

//@desc delete bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`bootcamp with id ${req.params.id} does not exists`, 404))
    }
    res.status(200).json({
        success: true, data: {}
    })
})
// exports.deleteBootcamp = async (req, res, next) => {
//     // res.status(200).json({ success: true, msg: `delete bootcamp ${req.params.id}` })
//     try {
//         const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

//         if (!bootcamp) {
//             return next(new ErrorResponse(`bootcamp with id ${req.params.id} does not exists`, 404))
//         }

//         res.status(200).json({
//             success: true, data: {}
//         })
//     } catch (error) {
//         // res.status(400).json({
//         //     success: false
//         // })
//         next(error)
//     }
// }