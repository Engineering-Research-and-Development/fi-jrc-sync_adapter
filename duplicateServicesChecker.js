let log = require('./logs/logger')

module.exports = {
    duplicateServicesCheker: async function (orionServices, adapterServices) {

        log.info("*** CHECKING FOR DUPLICATE SERVICES ***")

        let isNewServiceForOrion;
        let exclusiveServicesFromOrion = [];
        let exclusiveServicesFromAdapter = [];
        let servicesWinners = [];

        log.debug("Orion Services: " + orionServices.length)
        log.debug("Dymer Services: " + adapterServices.length)

        for (let adapterService of adapterServices) {

            isNewServiceForOrion = true;

            for (let orionService of orionServices) {
                // comparition
                //NOTE: insert always into exclusiveSerivcesFromOrion to compare later
                if (orionService["https://smartdatamodels.org/dataModel.DigitalInnovationHubService/title"].value == adapterService.title.value) {
                    if (orionService["https://smartdatamodels.org/dataModel.DigitalInnovationHubService/category"].value == adapterService.category.value) {
                        if (orionService["https://smartdatamodels.org/dataModel.DigitalInnovationHubService/url"].value == adapterService.url.value) {

                            //It's the same service
                            try {

                                if (Date.parse(adapterService.dateUpdated.value) > Date.parse(orionService.dateUpdated.value)) {
                                    log.debug("Service " + orionService.id + " is updating...")

                                    //the winner is adapterEntity
                                    log.debug("Services to merge: " + adapterService.id + " and " + orionService.id)

                                    servicesWinners.push({
                                        adapterServiceID: adapterService.id,
                                        orionServiceID: orionService.id,
                                        winner: adapterService,
                                        loser: orionService
                                    })
                                } else {
                                    // the winner is orionEntity
                                    log.debug("Services to merge: " + adapterService.id + " and " + orionService.id)

                                    servicesWinners.push({
                                        adapterServiceID: adapterService.id,
                                        orionServiceID: orionService.id,
                                        winner: orionService,
                                        loser: adapterService
                                    })
                                }

                            } catch (e) {
                                log.error("Error occurred due to: " + adapterService.id)
                            }
                        }
                    }
                }

            }
            if (isNewServiceForOrion) {
                log.debug("New Service " + adapterService.id + " to send to Orion")
                exclusiveServicesFromOrion.push(adapterService)
            }
        }

        //ExclusiveOrionEntities
        for (let orionService of orionServices) {
            let found = false
            for (let winnerService of servicesWinners) {
                if (winnerService.orionEntityID == orionService.id) {
                    found = true
                }
            }
            if (!found) {
                log.debug("New Service " + orionService.id + " to send to Dymer")
                exclusiveServicesFromOrion.push(orionService)
            }
        }


        log.info("*** CHECK FINISHED ***")

        return {
            exclusiveSerivcesFromOrion,
            exclusiveServicesFromAdapter,
            servicesWinners
        }
    }
}
