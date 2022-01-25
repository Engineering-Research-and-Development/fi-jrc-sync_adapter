let log = require('../utilities/logger')
let axios = require('axios')

require('dotenv').config({ path: __dirname + './../.env' })

module.exports = {

  // create a new entity
  createOrionEntity: async function (transactionUUID, ngsiLDPayload) {
    let options = {
      headers: {
        "Content-Type": "application/ld+json", // TODO: insert back ld+json
        "Fiware-Correlator": transactionUUID
      }
    };

    entityToOrion = JSON.parse(ngsiLDPayload)
    entityToOrion["@context"] = [
      "https://schema.lab.fiware.org/ld/context",
      "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"
    ]
    try {
      await axios.post(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities', entityToOrion, options)
    } catch (e) {
      log.error("Entity not created due to: " + e)
      return
    }
    log.info("created entity")
  },

  // check if does exist an entity
  doesEntityExistInOCB: async function (entityID) {
    log.debug("--- doesEntityExistInOCB ---");
    log.debug("Checking existence of entity id: " + entityID + " on OCB");

    try {
      let response = await axios.get(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities?id=' + entityID)

      if (response.data.length != 0) {
        return true
      } else {
        return false
      }

    } catch (e) {
      log.error("Unable verify the existence due to: " + e)
      return
    }

  },

  //update an entity
  updateOrionEntity: async function (transactionUUID, ngsiLDPayload) {

    let options = {
      headers: {
        "Content-Type": "application/ld+json",
        "Fiware-Correlator": transactionUUID
      }
    };

    entityToOrion = JSON.parse(ngsiLDPayload)

    let entityID = entityToOrion.id;

    entityToOrion["@context"] = [
      "https://schema.lab.fiware.org/ld/context",
      "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"
    ]

    try {
      await axios.patch(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities/' + entityID + "/attrs", entityToOrion, options)
    } catch (e) {
      log.error("Unable update entity " + entityID + " due to: " + e)
      return
    }
    log.info("updated entity: " + entityID)
  }
}