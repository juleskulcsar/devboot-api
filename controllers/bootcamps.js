const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')

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
    //console url parameters
    // console.log("req.query is: ", req.query)

    let query;

    //copy req.query object
    const requestQuery = { ...req.query }

    //fields to exclude from result
    const removeFields = ['select', 'sort']

    //loop over removeFields and delete them from requestQuery
    removeFields.forEach(param => delete requestQuery[param])

    // console.log('requestQuery: ', requestQuery)

    //create the query string
    let queryString = JSON.stringify(requestQuery)

    //create operators like gt, gte etc
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    // console.log('queryString: ', queryString)


    //find data
    query = Bootcamp.find(JSON.parse(queryString))

    //select fields --- read mongoose documenation
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        // console.log('fields: ', fields)
        query = query.select(fields)
    }

    //sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    //execute query
    // const bootcamps = await Bootcamp.find()
    const bootcamps = await query

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

//@desc get bootcamps within address radius
//@route GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;
    //get latitude and longitude from node-geocoder
    const place = await geocoder.geocode(zipcode);
    const latitude = place[0].latitude;
    const longitude = place[0].longitude;

    //calculate the radius
    //divide distance by Earth radius: 3,963 miles (6378 km)
    const radius = distance / 6378
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })

})