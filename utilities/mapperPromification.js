let ejs = require('ejs');
let fs = require('fs')
let log = require('./logger')
let entities = require ('../mapper/mapper_dih');
const { throttle } = require('lodash');



let render = function (template, data) {
    return new Promise((resolve, reject) => {
        ejs.renderFile(template, data, function (err, str) {
            if (err) {
                reject(err)
            } else {
                resolve(str)
            }
        });
    })
}



module.exports.toMap = async function mappingProcess(fileTemplate, data) {
let parsedJson

    try {
        let res = await render(fileTemplate, data);
        parsedJson = res.replace(/(\r\n|\n|\r|\t|\b|\f|\\)/gm, "")

        parsedJson = parsedJson.replace(/[^\x00-\x7F]/g, "")

    } catch (err) {
        log.error("Unable open template due to: " + err.message)
        throw err
    }

    try {
      
       return JSON.parse(parsedJson)

    } catch (err) {
        log.error("Unable parse template due to: " + err.message)
        log.error(parsedJson)
        throw err
    }
}