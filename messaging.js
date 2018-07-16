
const chalk = require("chalk");


function startMessage() {
    console.log(chalk.white.bgBlue.bold("Starting scraping app...\n"));
}

function dirMessage(dirName) {
    console.log(chalk.blue(`Creating directory: ${dirName}`));
}

function csvMessage(fileName) {
    console.log(chalk.blue(`Writing to file: ${fileName}`));
}

function scrapeMessage(description, url) {
    console.log(chalk.blue(`Scraping ${description} at ${url}...`));
}

function errorMessage(errMessage) {
    console.log(chalk.bgKeyword("darkred")("ERROR:", chalk.bgBlack.keyword("darkred") (`\t${errMessage}`)));
}

function infoMessage(information) {
    console.log(chalk.yellow(information));
}



module.exports.startMessage = startMessage;
module.exports.dirMessage = dirMessage;
module.exports.fileMessage = csvMessage;
module.exports.scrapeMessage = scrapeMessage;
module.exports.errorMessage = errorMessage;
module.exports.infoMessage = infoMessage;
