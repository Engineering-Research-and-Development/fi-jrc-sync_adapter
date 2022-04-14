var check = require('./duplicateChecker')
require('dotenv').config()

// let test = require('./test/dih')

// let orionEntities = test.OrionEntities
// let AdapterEntities = test.DymerEntities

async function IndexFunction () {
    let resp = await check.dupicateChecker(orionEntities, AdapterEntities)

   // console.log(JSON.stringify(resp))
}


IndexFunction()