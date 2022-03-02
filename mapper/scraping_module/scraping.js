const axios = require('axios')
const cheerio = require('cheerio')
let log = require('../../utilities/logger')
let utils = require('../../utilities/utils')


module.exports = {

    getAddingServices: async function (siteURL) {


        console.info("URL: " + siteURL)
        log.debug("Scraping retrieval in progress...")

        let hub
        let count = parseInt(process.env.ATTEMPTS_NUMBER)

        try {
            hub = await axios.get(siteURL)

        } catch (axiosErr) {
            count = count - 1;
            if (axiosErr.code == 'ECONNRESET' && count) {
                log.warning("Data "+ siteURL +" not catched: new attempt in progress")
                hub = await axios.get(siteURL)
            } else {
                throw axiosErr;
            }
        }

        try {
            log.debug("Information analysis in progress...")

            const $ = cheerio.load(hub.data)
            const elemSelector = ".hubCardContent"

            let TRLList = []
            let sectorList = []

            //Navigation
            $(elemSelector).each((parentIdx, parentElem) => {

                let sections = $(parentElem).children('.infoLabel')
                for (let section of sections) {

                    if ($(section).text() == 'Sectors') {

                        $(parentElem).children('ul').each((childIdx, childElem) => {

                            $(childElem).children('li').each((ind, el) => {

                                if (childIdx == 0) {
                                    sectorList.push($(el).text())
                                }

                            })

                        })
                    }
                }
            })

            const dataUpdateSelector = ".text-right"
            let lastUpdate = ""

            if ($(dataUpdateSelector).length >= 3) {


                $(dataUpdateSelector).each((pIdx, pElem) => {
                    if (pIdx == 1) {
                        lastUpdate = utils.stringToDate($(pElem).text())
                    }
                })
            } else {
                lastUpdate = ""
            }

            log.debug('scraping done')

            let scrapingData = {
                sectorList,
                lastUpdate
            }


            return scrapingData

        } catch (err) {
            console.error("Errore scr: ", err)
            throw err
        }
    }
}