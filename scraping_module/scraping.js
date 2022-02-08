const axios = require('axios')
const cheerio = require('cheerio')

let log = require('../utilities/logger')

module.exports = {

getAddingServices: async function (siteURL) {
    console.info("URL: " + siteURL)
    log.debug("Scraping retrieval in progress...")
    
    try {
        const hub = await axios({
            method: "GET",
            url: siteURL,
        })

        log.debug("Information analysis in progress...")

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


       log.debug('scraping done')
    
       return sectorList

    } catch (err) {
        log.warning('Failed scraping operation due to: ' + err)
        log.warning('Code error: ' + err.code)
        log.warning('Try again...')
        await this.getAddingServices(siteURL)
        return
    }
}
}

