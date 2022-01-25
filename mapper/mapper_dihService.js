let log = require('../utilities/logger')
let mp = require('../utilities/mapperPromification')
let scr = require('../scraping_module/scraping')

let rest = require('../ocb-rest/core')

require('dotenv').config({ path: __dirname + './../.env' })

const serviceURLToDelete = 'https://s3platform-legacy.jrc.ec.europa.eu/digital-innovation-hubs-tool/-/dih/1326/view'

module.exports.getServices = async function getService(DIH_item) {

    let DIH_service;
    let orionHUB = DIH_item.properties.hubId
    let servicesArray = []

    for (let index = 0; index < DIH_item.properties.servicesProvided.length; index++) {
        DIH_item.index = index;

        DIH_item.id = process.env.ENTITIES_URI_PREFIX_SERVICE + orionHUB + ":" + DIH_item.properties.servicesProvided[index].id

        try {
            DIH_service = await mp.toMap(process.env.DIH_S_TEMPLATE, DIH_item)
            servicesArray.push(DIH_service)

        } catch (e) {
            log.error("Unable map service " + DIH_item.properties.servicesProvided[index] +
                "from HUB: " + DIH_item.id + " due to: " + e)
        }

        // Create or modify entity
        // let doesExist = await rest.doesEntityExistInOCB(DIH_item.id)

        // log.info("Detection for " + DIH_item.id + ": " + doesExist)

        // if (doesExist == true) {
        //     await rest.updateOrionEntity(process.env.TRANSACTION_UUID, DIH_service)
        // } else {
        //     await rest.createOrionEntity(process.env.TRANSACTION_UUID, DIH_service)
        // }        
    }
    return servicesArray
}
