let log = require('../utilities/logger')
let mp = require('../utilities/mapperPromification')
let services = require('./mapper_dihService')
let addingFields = require('../scraping_module/scraping')
let rest = require('../ocb-rest/core')



let axios = require('axios')
require('dotenv').config({ path: __dirname + './../.env' })

const cheerio = require('cheerio')

function sleep(delay) {
  return new Promise((resolve, reject)=> { 
    setTimeout(() => resolve(), delay)
  })
}


async function getData() {

  let dihArray = [];
 // let dihServiceArray = [];

  try {
    let response = await axios.get(process.env.URL);
    
    for (let item of response.data.features) {
  
      // clear description
      const $ = cheerio.load(item.properties.description)
      item.properties.description = $('html').text()

      // Set ID
      item.id = process.env.ENTITIES_URI_PREFIX + item.properties.hubId
      log.info("processing DigitalInnovationHub: " + item.id)

      // Catch domain
      item.sectors = await addingFields.getAddingServices(item.properties.hubProfileURL)
      await sleep(100)

      // map in template
      let DIH = await mp.toMap(process.env.DIH_TEMPLATE, item)

      // Build Array
      dihArray.push(DIH)
    } 
    
    
    console.debug("\n\nReady to send to Orion...\n\n")

    try {
      await rest.createOrModifyUpsert(dihArray)
    } catch (e) {
      log.error("Unable update due to: " + e.message)
    }
    

  } catch (e) {
    log.error("MAPPER: Unable create or update due to: " + e.message)
    log.error("MAPPER error code: "+ e.code)
    return
  }
}


getData()

