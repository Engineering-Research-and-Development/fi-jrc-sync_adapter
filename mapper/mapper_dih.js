let log = require('../utilities/logger')
let mp = require('../utilities/mapperPromification')
let addingFields = require('./scraping_module/scraping')
let rest = require('../ocb-rest/core')
let axios = require('axios')
require('dotenv').config({ path: __dirname + './../.env' })


const cheerio = require('cheerio')

function sleep(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), delay)
  })
}

module.exports = {

  getData: async function (response) {
    let dihArray = [];
    let wrongData = [];
    let DIH;

    try {

      for (let item of response.data.features) {

        // clear description
        const $ = cheerio.load(item.properties.description)
        item.properties.description = $('html').text()

        // Set ID
        item.id = process.env.ENTITIES_URI_PREFIX + item.properties.hubId
        log.info("processing DigitalInnovationHub: " + item.id)

        await sleep(100)

        let infoFromScraping = await addingFields.getAddingServices(item.properties.hubProfileURL)

        console.log("le info sono prese sono: ", infoFromScraping)
        item.sectors = infoFromScraping.sectorList
        item.lastUpdate = infoFromScraping.lastUpdate

        try {
          // map in template
          DIH = await mp.toMap(process.env.DIH_TEMPLATE, item)

        } catch (e) {
          log.error("Unable map " + item.id + " due to: " + e.message)
          console.debug("Saving DIH to retry later... ", e)
          wrongData.push(item)

        }
        // Build Array
        dihArray.push(DIH)
      } //for

      if (wrongData.length != 0) {
        console.log("There are " + wrongData.length + " not mapped DIH")
        for (let w_item of wrongData) {
          console.log("Error caused by: " + w_item.id)

        }
        return
      }
      console.log("There are " + wrongData.length + " not mapped DIH")

      return dihArray
 

    } catch (e) {

      log.error("MAPPER: Unable create or update due to: " + e.message)
      log.error("MAPPER error code: " + e.code)
      return

    }
  }

}
//getData()

