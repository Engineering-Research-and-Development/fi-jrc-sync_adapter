let log = require('../utilities/logger')
let mp = require('../utilities/mapperPromification')
let services = require('./mapper_dihService')

let rest = require('../ocb-rest/core')

let axios = require('axios')
require('dotenv').config({ path: __dirname + './../.env' })


async function getData() {

  let dihArray = [];
  let dihServiceArray = [];

  try {
    let response = await axios.get(process.env.URL);


    for (let item of response.data.features) {

      item.id = process.env.ENTITIES_URI_PREFIX + item.properties.hubId

      let DIH = await mp.toMap(process.env.DIH_TEMPLATE, item)

      dihArray.push(DIH)
      // let doesExist = await rest.doesEntityExistInOCB(item.id)

      // log.debug("Detection for " + item.id + ": " + doesExist)

      // if (doesExist == true) {
      //   await rest.updateOrionEntity(process.env.TRANSACTION_UUID, DIH)
      // } else {

      //   await rest.createOrionEntity(process.env.TRANSACTION_UUID, DIH)
      // }
      if (item.properties.servicesProvided) {

        try {

          let dihServices = await services.getServices(item) //  to retrieve the services
          dihServiceArray = dihServiceArray.concat(dihServices)

        } catch (err) {
          log.error("Unable catch services for dih " + item.id + " due to: " + err)
        }
      }
    }

    console.log(dihServiceArray)
    console.log(dihArray)

  } catch (e) {
    log.error("Unable create or update the operation due to: " + e)
  }
}


getData()

