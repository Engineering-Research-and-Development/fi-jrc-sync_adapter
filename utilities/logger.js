const logLevels = ['FATAL','ERROR', 'INFO', 'WARN', 'DEBUG']

const colors = {
    magenta: "\x1b[35m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    reset: "\x1b[0m"
}

function printLog(level, messageToPrint, color) {
    console.log(color, "["+ level + "][" + (new Date()).toISOString() + "]" + messageToPrint, colors.reset)
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