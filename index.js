var check = require('./duplicateChecker')
require('dotenv').config()

let orionEntities = []
let DymerEntities = []

async function IndexFunction () {
    check.dupicateChecker(orionEntities, DymerEntities)
}


IndexFunction()