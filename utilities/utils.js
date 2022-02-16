module.exports = {
    stringToDate: function(dateFromScraping) {

        let cleanString = dateFromScraping.replace(/(\n|\r|\t|\f|\\)/gm, "")
        let arrayElementsDate = cleanString.split(" ")

        let arrayDate = arrayElementsDate[3].split("/")
        let arrayHour = arrayElementsDate[4].split(":")

        let yearIndex = "20"+arrayDate[2]
        let monthIndex = arrayDate[1] - 1
        let dayIndex = arrayDate[0]
        let hour = arrayHour[0]
        let minutes = arrayHour[1]
        let seconds = 0

        let date = new Date(yearIndex, monthIndex, dayIndex, hour, minutes, seconds)
        let dateString = date.toISOString()

        return dateString
    }
}