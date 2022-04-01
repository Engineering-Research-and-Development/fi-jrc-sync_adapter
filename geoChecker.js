let turf = require('@turf/turf')
require('dotenv').config()

module.exports = {

    checkDistance: async function (centre, pointToCheck) {
        
        let radius = parseFloat(process.env.RADIUS)
        var options = { steps: process.env.STEPS, units: process.env.UNIT };

        let point = turf.point(pointToCheck)

        try {
            var circle = turf.circle(centre, radius, options)

            let res = turf.booleanContains(circle, point)
            return res

        } catch (e) {
            console.log(e.message)
        }
    }
}