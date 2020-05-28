const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    //copy req.query object
    const requestQuery = { ...req.query }

    //fields to exclude from result
    const removeFields = ['select', 'sort', 'limit', 'page']

    //loop over removeFields and delete them from requestQuery
    removeFields.forEach(param => delete requestQuery[param])

    // console.log('requestQuery: ', requestQuery)

    //create the query string
    let queryString = JSON.stringify(requestQuery)

    //create operators like gt, gte etc
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    // console.log('queryString: ', queryString)


    //find data
    //populate will do a reverse populate, showing courses in bootcamps/ virtuals
    // query = model.find(JSON.parse(queryString)).populate('courses')
    query = model.find(JSON.parse(queryString))

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

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await model.countDocuments()

    query = query.skip(startIndex).limit(limit);


    //this replaces the populate method on line 25.
    //This way it is more generic and can be used on other resources as well
    if (populate) {
        query = query.populate(populate)
    }

    //execute query
    // const bootcamps = await Bootcamp.find()
    const results = await query

    //pagination result
    let pagination = {}

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit: limit
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next()
}

module.exports = advancedResults