let log = require('../utilities/logger')
let axios = require('axios');
var bson = require('../utilities/bsonSerialization')

var { RESTCallsManager } = require('../restCallManager/core')

const oauthAxios = RESTCallsManager.getOAuthAxiosClient();

require('dotenv').config({ path: __dirname + './../.env' })

module.exports = {

  // create a new entity
  createOrionEntity: async function (ngsiLDPayload) {
    let options = {
      headers: {
        "Content-Type": "application/ld+json",
      },
      validateStatus: s => true
    };
    entityToOrion = JSON.parse(ngsiLDPayload)

    entityToOrion["@context"] = [
      "https://schema.lab.fiware.org/ld/context",
      "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"
    ]

    try {

      //let resp = await axios.post(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities', entityToOrion, options)
      let resp = await oauthAxios.post(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities', entityToOrion, options)
      if (resp.status != 200 && resp.status != 201) {
        console.error(resp.data)
        throw new Error(resp.status)
      }
    } catch (e) {
      log.error("Entity not created due to: " + e.message)
      throw e
    }
    log.info("created entity")
  },

  // check if does exist an entity
  doesEntityExistInOCB: async function (entityID) {
    log.debug("--- doesEntityExistInOCB ---");
    log.debug("Checking existence of entity id: " + entityID + " on OCB");

    try {
      //let response = await axios.get(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities?id=' + entityID)
      let response = await oauthAxios.get(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities?id=' + entityID)

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
  updateOrionEntity: async function (ngsiLDPayload) {

    let options = {
      headers: {
        "Content-Type": "application/ld+json",
      }
    };

    entityToOrion = JSON.parse(ngsiLDPayload)

    let entityID = entityToOrion.id;

    entityToOrion["@context"] = [
      "https://schema.lab.fiware.org/ld/context",
      "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"
    ]

    try {
      //let resp = await axios.patch(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities/' + entityID + "/attrs", entityToOrion, options)
      let resp = await oauthAxios.patch(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities/' + entityID + "/attrs", entityToOrion, options)
      if (resp.status != 200 && resp.status != 201) {
        console.error(resp.data)
        throw new Error(resp.status)
      }
    } catch (e) {
      log.error("Unable update entity " + entityID + " due to: " + e.message)

      return
    }
    log.info("updated entity: " + entityID)
  },

  createOrModifyUpsert: async function (ngsiLDPayloadArray) {
    log.info("Create or update entities in multi-id mode...")

    let options = {
      headers: {
        "Content-Type": "application/ld+json",
        //"Content-Type": "application/bson",
      },
      validateStatus: s => true
    };

    try {

      let start, end = ngsiLDPayloadArray.length, chunk, step = parseInt(process.env.CHUNK_SIZE);


      for (start = 0; start < end; start += step) {
        chunk = ngsiLDPayloadArray.slice(start, start + step)

        /* Bson */
        // console.debug("BSON serialization started...")
        // let bsonChunk = await bson.serialize(chunk)
        // console.debug("BSON serialization completed")
        /**/

        //let resp = await axios.post(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entityOperations/upsert', chunk/*bsonChunk*/, options)
        let resp = await oauthAxios.post(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entityOperations/upsert', chunk/*bsonChunk*/, options)
        if (resp.status != 200 && resp.status != 201 && resp.status != 207 && resp.status != 204) {
          // one - to - one to reduce loss
          reduceLoss(chunk)
        } else {
          log.debug("CHUNK [" + start + " of " + end + "] elements processed")
        }
      }

    } catch (err) {
      log.error("Unable update or create entities due to: " + err.message)
      throw err;
    }

    log.info("orion is updated about JRC data")
  },

  getAllEntities: async function (elements) {

    let options = {
      headers: {
        "Content-Type": "application/ld+json",
      },
    };

    try {

      //let resp = await axios.get(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities?type=' + process.env.ENTITIES_TYPE + "&limit=" + elements, options)
      let resp = await oauthAxios.get(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities?type=' + process.env.ENTITIES_TYPE + "&limit=" + elements, options)

      if (resp.status != 200) {
        console.error(resp.data)
        throw new Error(resp.status)
      }
      return resp.data

    } catch (e) {
      log.error("Unable get all entities due to: " + e.message)
      throw e
    }
  }
}

// To reduce loss
async function reduceLoss(chunk) {
  for (let i; i < chunk.length; i++) {

    let doesExist = await doesEntityExistInOCB(chunk[i].id)
    log.debug("Detection for " + chunk[i].id + ": " + doesExist)

    if (doesExist == true) {
      //await axios.post(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities', chunk[i], options)
      await oauthAxios.post(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities', chunk[i], options)
    } else {
     // resp = await axios.patch(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities/' + entityID + "/attrs", chunk[i], options)
      resp = await oauthAxios.patch(process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + '/ngsi-ld/v1/entities/' + entityID + "/attrs", chunk[i], options)
    }
  }
  return
}