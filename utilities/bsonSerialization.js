const BSON = require('bson');
const { forEach } = require('lodash');
const Long = BSON.Long;


module.exports = {
    serialize: async function (jsonArrayData) {
        let bsonArrayData = []

        forEach(jsonArrayData, (jsonData) => {
            let bsonData = BSON.serialize(jsonData)

            bsonArrayData.push(bsonData)
        })
        
        return bsonArrayData
    }
}