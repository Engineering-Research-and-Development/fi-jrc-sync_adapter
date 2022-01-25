let ejs = require('ejs');
let fs = require('fs')
let log = require('./logger')
let entities = require ('../mapper/mapper_dih')



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
    try {
        let res = await render(fileTemplate, data);
        let parsedJson = res.replace(/(\r\n|\n|\r|\t)/gm, "")                            

        //console.log(JSON.parse(parsedJson))
       // console.log(parsedJson)
       return parsedJson

    } catch (err) {
        log.error("Unable open template due to: " + err)
    }
}