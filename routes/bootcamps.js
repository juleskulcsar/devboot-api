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

const router = express.Router()

//where we use protect, user must be looged in
const { protect } = require('../middleware/auth')

//re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router.route('/:id/photo').put(protect, bootcampPhotoUpload)
router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, createBootcamp)
router
    .route("/:id")
    .get(getBootcamp)
    .put(protect, updateBootcamp)
    .delete(protect, deleteBootcamp)

module.exports = router