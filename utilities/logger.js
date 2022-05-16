const logLevels = ['FATAL', 'ERROR', 'INFO', 'WARN', 'DEBUG']
require('dotenv').config({ path: __dirname + './../.env' })

const fs = require('fs')

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
    }
}

module.exports = {
    fatal(msg) {
        printLog("FATAL", msg, colors.magenta)
    },
    error(msg) {
        printLog("ERROR", msg, colors.red)
    },
    warning(msg) {
        printLog("WARN", msg, colors.yellow)
    },
    info(msg) {
        printLog("INFO", msg, colors.reset)
    },
    debug(msg) {
        printLog("DEBUG", msg, colors.green)
    },
};