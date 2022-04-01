let checker = require('./geoChecker')
let log = require('./logs/logger')
let _ = require('lodash')


module.exports = {
    dupicateChecker: async function (orionEntities, AdapterEntities) {

        log.info("*** CHECKING FOR DUPLICATES ***")

        let isNewEntityForOrion;

        let exclusiveFormOrion = []

        let exclusiveFromAdapter = []
       // let exclusiveFormOrion = []
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
                                log.debug("Entities to merge: " + adapterEntity.id + " and " + orionEntity.id)

                                winners.push({
                                    adapterEntityID: adapterEntity.id,
                                    orionEntityID: orionEntity.id,
                                    winner: adapterEntity,
                                    loser: orionEntity
                                })

                                exclusiveFormOrion.push(orionEntity.id)
                            } else {
                                // the winner is orionEntity
                                log.debug("Entities to merge: " + adapterEntity.id + " and " + orionEntity.id)

                                winners.push({
                                    adapterEntityID: adapterEntity.id,
                                    orionEntityID: orionEntity.id,
                                    winner: orionEntity,
                                    loser: adapterEntity
                                })

                                exclusiveFormOrion.push(orionEntity.id)
                            }

                        } catch (e) {
                            log.error("Error occurred due to: " + adapterEntity.id)
                        }
                    }

                }
            }
            if (isNewEntityForOrion) {
                log.debug("New entity " + adapterEntity.id + " to send to Orion")
                exclusiveFromAdapter.push(adapterEntity)
            }
        }

        // catch orionNewEntity
        exclusiveFormOrion = [...new Set(exclusiveFormOrion)];

        log.debug("New entities From Orion to send to Dymer: " + exclusiveFormOrion)
        for (let commonEntity of exclusiveFormOrion) {
            orionEntities.filter(orionEntity => {
                orionEntity.id == commonEntity
            })

        }

        log.info("*** finished check ***")

        return {
            exclusiveFromAdapter,
            exclusiveFormOrion,
            winners
        }
    }
}