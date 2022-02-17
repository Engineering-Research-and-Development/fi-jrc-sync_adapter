const logLevels = ['FATAL', 'ERROR', 'INFO', 'WARN', 'DEBUG']
require('dotenv').config({ path: __dirname + './../.env' })

const fs = require('fs')
const  logNameFile = require('../index')

const colors = {
    magenta: "\x1b[35m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    reset: "\x1b[0m"
}

function printLog(level, messageToPrint, color) {
    let logLevelsToShow = logLevels

    if (logLevels.includes(process.env.LOG_LEVEL)) {
        logLevelsToShow = logLevels.slice(0, logLevels.indexOf(process.env.LOG_LEVEL) + 1);
    }

    if (logLevelsToShow.includes(level)) {
        console.log(color, "[" + level + "][" + (new Date()).toISOString() + "]" + messageToPrint, colors.reset)
        fs.appendFileSync(logNameFile.logNameFile, "[" + level + "][" + (new Date()).toISOString() + "]"+ messageToPrint);
    }
}

module.exports = {
    fatal(msg) {
        printLog("FATAL", msg, colors.magenta)
        //    console.log(colors.reset)
    },
    error(msg) {
        printLog("ERROR", msg, colors.red)
        //    console.log(colors.reset)
    },
    warning(msg) {
        printLog("WARN", msg, colors.yellow)
        //   console.log(colors.reset)
    },
    info(msg) {
        printLog("INFO", msg, colors.reset)
        //     console.log(colors.reset)
    },
    debug(msg) {
        printLog("DEBUG", msg, colors.green)
        //   console.log(colors.reset)
    },
};