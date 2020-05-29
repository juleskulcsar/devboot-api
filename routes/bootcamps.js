const express = require('express')

const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps')

const advancedResults = require('../middleware/advancedResults')
const Bootcamp = require('../models/Bootcamp')

//include other resource routers
const courseRouter = require('./courses')
const reviewRouter = require('./reviews')

const router = express.Router()

//where we use protect, user must be looged in
const { protect, authorize } = require('../middleware/auth')

//re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)
router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp)
router
    .route("/:id")
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

module.exports = router