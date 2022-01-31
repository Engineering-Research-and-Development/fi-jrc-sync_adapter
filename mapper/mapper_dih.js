let log = require('../utilities/logger')
let mp = require('../utilities/mapperPromification')
let services = require('./mapper_dihService')

let rest = require('../ocb-rest/core')

let axios = require('axios')
require('dotenv').config({ path: __dirname + './../.env' })

const cheerio = require('cheerio')


async function getData() {

  let dihArray = [];
  let dihServiceArray = [];

  try {
    let response = await axios.get(process.env.URL);

    for (let item of response.data.features) {

      const $ = cheerio.load(item.properties.description)
      item.properties.description = $('html').text()


      item.id = process.env.ENTITIES_URI_PREFIX + item.properties.hubId

      let DIH = await mp.toMap(process.env.DIH_TEMPLATE, item)

      dihArray.push(DIH)


      /*********************/

      if (item.properties.servicesProvided) {

        try {

          let dihServices = await services.getServices(item) //  to retrieve the services
          dihServiceArray = dihServiceArray.concat(dihServices)

        } catch (err) {
          log.error("Unable catch services for dih " + item.id + " due to: " + err)
        }
      }

      /*********************/
    } 


    try {
      await rest.createOrModifyUpsert(process.env.TRANSACTION_UUID, dihArray)
    } catch (e) {
      log.error("Unable update due to: " + e.message)
    }
    
    console.info("SERVICES")
    
    try {
      await rest.createOrModifyUpsert(process.env.TRANSACTION_UUID, dihServiceArray)
    } catch (e) {
      log.error("Unable update due to: " + e.message)
    }

  } catch (e) {
    log.error("MAPPER: Unable create or update due to: " + e.message)
  }
}


getData()

