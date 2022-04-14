let checker = require('./geoChecker')
let log = require('./logs/logger')
let _ = require('lodash')

module.exports = {
    dupicateChecker: async function (orionEntities, AdapterEntities) {

        log.info("*** CHECKING FOR DUPLICATES ENTITIES ***")

        let isNewEntityForOrion;
        let exclusiveFromOrion = []
        let exclusiveFromAdapter = []       
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

                            if (Date.parse(adapterEntity.dateUpdated.value) > Date.parse(orionEntity.dateUpdated.value)) {
                                log.debug("Entity " + orionEntity.id + " is updating...")

                                //the winner is adapterEntity
                                log.debug("Entities to merge: " + adapterEntity.id + " and " + orionEntity.id)

                                winners.push({
                                    adapterEntityID: adapterEntity.id,
                                    orionEntityID: orionEntity.id,
                                    winner: adapterEntity,
                                    loser: orionEntity
                                })

                            } else {
                                // the winner is orionEntity
                                log.debug("Entities to merge: " + adapterEntity.id + " and " + orionEntity.id)

                                winners.push({
                                    adapterEntityID: adapterEntity.id,
                                    orionEntityID: orionEntity.id,
                                    winner: orionEntity,
                                    loser: adapterEntity
                                })
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

        //ExclusiveOrionEntities
        for (let orionEntity of orionEntities) {
            let found = false
            for (let winnerEntity of winners) {
                if(winnerEntity.orionEntityID == orionEntity.id) {
                    found = true
                }                
            }
            if(!found) {
                log.debug("New entity " + orionEntity.id + " to send to Dymer")
                exclusiveFromOrion.push(orionEntity)
            }
        }


        log.info("*** CHECK FINISHED ***")

        return {
            exclusiveFromAdapter,
            exclusiveFromOrion,
            winners
        }
    }
}