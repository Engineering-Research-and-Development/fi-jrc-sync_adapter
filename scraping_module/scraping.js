// this module to catch TRL - Not used yet

const axios = require('axios')
const cheerio = require('cheerio')

let log = require('../utilities/logger')

// const

    // Remove to pass as function param
    //siteURL = 'https://s3platform-legacy.jrc.ec.europa.eu/digital-innovation-hubs-tool/-/dih/3480/view'
    // siteURL = 'https://s3platform-legacy.jrc.ec.europa.eu/digital-innovation-hubs-tool/-/dih/1326/view'

module.exports = {
//async function getServices(siteURL) {
getAddingServices: async function (siteURL) {

    log.info("Information retrieval in progress...")

    try {
        const hub = await axios({
            method: "GET",
            url: siteURL
        })

        log.info("Information analysis in progress...")

        const $ = cheerio.load(hub.data)
        const elemSelector = ".hubCardContent"
        
        let TRLList = []
        let sectorList = []

        //Navigation
        $(elemSelector).each((parentIdx, parentElem) => {            

            if (parentIdx == 3) {                         
                $(parentElem).children('ul').each((childIdx, childElem) => {
                    
                    $(childElem).children('li').each((ind, el) => {
                        if(childIdx == 1) {
                            TRLList.push($(el).text())
                        } else if (childIdx == 0) {
                            sectorList.push($(el).text())
                        }
                       
                    })           
                
                })
            }
        })

        return TRLList
       // console.log(TRLList)
      //  console.log(sectorList)

    } catch (err) {
        log.error('Failed scraping operation due to: ' + err)
    }
}
}
//getServices(siteURL)
