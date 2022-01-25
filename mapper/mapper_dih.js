let log = require('../utilities/logger')
let mp = require('../utilities/mapperPromification')
let services = require('./mapper_dihService')

let rest = require('../ocb-rest/core')

let axios = require('axios')
require('dotenv').config({ path: __dirname + './../.env' })


async function getData() {

  try {
    let response = await axios.get(process.env.URL);


    for (let item of response.data.features) {
      item.id = process.env.ENTITIES_URI_PREFIX + item.properties.hubId

      let DIH = await mp.toMap(process.env.DIH_TEMPLATE, item)


      let doesExist = await rest.doesEntityExistInOCB(item.id)

      log.debug("Detection for " + item.id + ": " + doesExist)

      if (doesExist == true) {
        await rest.updateOrionEntity(process.env.TRANSACTION_UUID, DIH)
      } else {

        await rest.createOrionEntity(process.env.TRANSACTION_UUID, DIH)
      }

      try {
        await services.getServices(item) //  to retrieve the services
      } catch (err) {
        log.error("Unable catch services due to: " + err)
      }
    }

  } catch (e) {
    log.error("Unable create or update the operation due to: " + e)
  }
}


getData()

