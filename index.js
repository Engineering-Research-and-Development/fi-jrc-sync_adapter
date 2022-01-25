require('dotenv').config()

var CronJob = require('cron').CronJob;
var log = require('./utilities/logger')
var adapterJob = require('./mapper/mapper_dih')


let temporizedJob = new CronJob(process.env.INTERVAL, () => {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    log.info("Job started on " + date + "at " + time)

    adapterJob.getData()

}, null, true, process.env.LOCAL_TIME);

temporizedJob.start();
