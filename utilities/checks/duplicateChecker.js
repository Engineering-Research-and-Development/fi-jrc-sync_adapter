let checker = require('./checkers')
let log = require('../logger')
let utils = require('../utils')
const { logNameFile } = require('../..')


module.exports = {
    // // provisional complexity O(m*n)
    duplicateChecker: async function (orionEntities, JRCEntities) {

        log.info("*** Check for duplicates ***")

        let isNewEntity;
        let entitiesToUpdate = []

        log.debug("orionEntities " + orionEntities.length + " elements")
        log.debug("JRCEntities " + JRCEntities.length + " elements")


        for (let JRCEntity of JRCEntities) {
            let JRCHubCoordinates = [JRCEntity.geometry.value.coordinates[0].toFixed(6), JRCEntity.geometry.value.coordinates[1].toFixed(6)]

            isNewEntity = true;

            for (let orionEntity of orionEntities) {

                let orionHubCoordinater = [orionEntity.geometry.value.coordinates[0], orionEntity.geometry.value.coordinates[1]]

                if (await checker.checkDistance(JRCHubCoordinates, orionHubCoordinater)) {
                    // nearby Hub
                    //Must check other fields

                    if (orionEntity["https://smartdatamodels.org/dataModel.DigitalInnovationHub/website"].value == JRCEntity.website.value) {
                        //This is the same entity
                        isNewEntity = false;
                        try {

                            if (Date.parse(JRCEntity.lastUpdate.value) > Date.parse(orionEntity.lastUpdate.value)) {
                                // new is more recent. Catch to upadate
                                log.debug("Entity " + orionEntity.id + " is updating...")
                                entitiesToUpdate.push(JRCEntity)

                            }
                        } catch (e) {
                            log.error("probema con " + JRCEntity.id)
                        }
                    }
                }
            }
            // Catch new entities
            if (isNewEntity) {
                log.debug("New " + JRCEntity.id + " found")
                entitiesToUpdate.push(JRCEntity)
            }
        }
        log.info(entitiesToUpdate.length + " entities to update or create")
        log.info("*** finished check ***")
        return entitiesToUpdate
    }
}

