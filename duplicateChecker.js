let checker = require('./geoChecker')
let log = require('./logs/logger')
let _ = require('lodash')


module.exports = {
    dupicateChecker: async function (orionEntities, AdapterEntities) {

        log.info("*** CHECKING FOR DUPLICATES ***")

        let isNewEntityForOrion;

        let commonEntities = []

        let exclusiveFromAdapter = []
        let exclusiveFormOrion = []
        let winners = []


        log.debug("Orion Entities: " + orionEntities.length)
        log.debug("Dymer Entities: " + AdapterEntities.length)

        for (let adapterEntity of AdapterEntities) {
            let adapterHubCoordinates = [adapterEntity.location.value.coordinates[0].toFixed(6), adapterEntity.location.value.coordinates[1].toFixed(6)]

            isNewEntityForOrion = true;

            for (let orionEntity of orionEntities) {

                let orionHubCoordinates = [orionEntity.location.value.coordinates[0], orionEntity.location.value.coordinates[1]]

                if (await checker.checkDistance(adapterHubCoordinates, orionHubCoordinates)) {
                    // nearby Hub
                    // Must check other fields

                    if (orionEntity["https://smartdatamodels.org/dataModel.DigitalInnovationHub/website"].value == adapterEntity.website.value) {
                        isNewEntityForOrion = false;

                        try {

                            if (Date.parse(adapterEntity.lastUpdate.value) > Date.parse(orionEntity.lastUpdate.value)) {
                                log.debug("Entity " + orionEntity.id + " is updating...")

                                //the winner is adapterEntity
                                winners.push({
                                    adapterEntityID: adapterEntity.id,
                                    orionEntityID: orionEntity.id,
                                    winner: adapterEntity,
                                    loser: orionEntity
                                })

                                commonEntities.push(orionEntity.id)
                            } else {
                                // the winner is orionEntity
                                winners.push({
                                    adapterEntityID: adapterEntity.id,
                                    orionEntityID: orionEntity.id,
                                    winner: orionEntity,
                                    loser: adapterEntity
                                })

                                commonEntities.push(orionEntity.id)
                            }

                        } catch (e) {
                            log.error("Error occurred due to: " + adapterEntity.id)
                        }
                    }

                }
            }
            if (isNewEntityForOrion) {
                log.debug("New " + adapterEntity.id + " found")
                exclusiveFromAdapter.push(adapterEntity)
            }
        }

        // catch orionNewEntity
        commonEntities = [...new Set(commonEntities)];

        for (let commonEntity of commonEntities) {
           orionEntities.filter(orionEntity => {
                orionEntity.id == commonEntity
            })
            
        }

        log.info("*** finished check ***")

        return {
            exclusiveFromAdapter,
            exclusiveFormOrion: orionEntities,
            winners
        }
    }
}