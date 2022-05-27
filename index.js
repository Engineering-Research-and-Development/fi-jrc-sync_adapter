require('dotenv').config({ path: __dirname + './.env' })

var CronJob = require('cron').CronJob;
var log = require('./utilities/logger')
var adapterJob = require('./mapper/mapper_dih')
//var fs = require('fs')
var axios = require('axios')
let rest = require('./ocb-rest/core');
const utils = require('./utilities/utils');
const checkers = require('./utilities/checks/duplicateChecker')
var bson = require('./utilities/bsonSerialization')
const { AuthTokensManager } = require('./authTokensManager/core');


//let temporizedJob = new CronJob(process.env.INTERVAL, async function () {
async function temporizedJob() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

 //  let folder = './logs';

    await AuthTokensManager.init();

    // if (!fs.existsSync(folder)) {
    //     fs.mkdirSync(folder);
    // }
    // let logNameFile = folder + "/" + date + ".log"

    // exports.logNameFile = logNameFile

    log.info("Job started on " + date + " at " + time)

    let dihArray = []
    let updateOrCreateArray = []

    let axiosConfig = {
        maxContentLength: Infinity, 
        maxBodyLength: Infinity        
    };

    try {
        console.log("TRY THE AXIOS")
        let response = await axios.get(process.env.URL, axiosConfig);
        console.log("END AXIOS")
        dihArray = await adapterJob.getData(response)

    } catch (e) {
        log.error("Unable retrieve data from JRC-Platform due to: " + e.message)
    }

    log.debug("\n\nReady to send to Orion...\n\n")


   //let orionEntities = await rest.getAllEntities(dihArray.length);
   let orionEntities = await rest.getAllOrionEntities();

   log.warning(orionEntities.length)

    updateOrCreateArray = await checkers.duplicateChecker(orionEntities, dihArray)


    if (updateOrCreateArray.length != 0) {
        try {
            log.info("Orion is updating...")

            // await rest.createOrModifyUpsert(dihArray)
            await rest.createOrModifyUpsert(updateOrCreateArray)

            log.info("Orion is updated")
        } catch (e) {
            log.error("Unable update due to: " + e.message)
        }
    }

    log.info("Job Ended on " + date + " at " + time)
} // fake function
//    }, null, true, process.env.LOCAL_TIME);

//    temporizedJob.start();


temporizedJob();