
const fs = require("fs");
const http = require("http");
const messaging = require("./messaging.js");
const Json2csvParser = require("json2csv").Parser;
const scrapeIt = require("scrape-it");
const siteRoot = `http://tshirts4mike.com`;
const mainPage = `${siteRoot}/shirts.php`;
const dataDirectory = "./data";
const timeNow = new Date();
const formattedTime = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`;
const formatedDay = `${timeNow.getFullYear()}-${timeNow.getMonth() + 1}-${timeNow.getDate()}`;
const fields = ["Title", "Price", "ImageURL", "URL", "Time"];
let shirtsResults = [];


// message the user that the app has started
messaging.startMessage();
messaging.scrapeMessage("entry point", mainPage);

function writeErrorLog(friendlyError, error) {
    fs.appendFile('./scraper-error.log',`${timeNow} ${friendlyError} Actual error: ${error}\n`, function (err) {
        if (err) throw err;
    });
}

// scrape the main entry point
scrapeIt(mainPage, {
    // retrieve the links to the subpages
    shirts: {
        listItem: ".products li",
        data: {
            url: {
                selector: "a",
                attr: "href"
            }
        }
    }
}).then(({ data, response }) => {
    // make the data directory if it doesn't already exist
    if (!fs.existsSync(dataDirectory)) {
        messaging.dirMessage(dataDirectory);
        fs.mkdirSync(dataDirectory);
    }

    for(let shirt of data.shirts) {
        messaging.scrapeMessage(`subpage`, `${siteRoot}/${shirt.url}`);
        scrapePage(shirt);
    }

    setTimeout(() => {
        try {
            const parser = new Json2csvParser({ fields });
            const csv = parser.parse(shirtsResults);
            fs.writeFile(`${dataDirectory}/${formatedDay}.csv`, csv, (err) => {
                messaging.fileMessage(`${formatedDay}.csv`);
                if(err) {
                    let fError = `Could not write to file: ${err.path}`;
                    writeErrorLog(fError, err);
                    messaging.errorMessage(`Could not write to file: ${err.path}`);
                    messaging.infoMessage(`More information found in scraper-error.log.`);
                }
            });
        } catch (err) {
            console.log(err);
        };
    }, 5000);
}).catch(function(err) {
    let fError = "This website is currently unavailable.";
    writeErrorLog(fError, err);
    messaging.errorMessage(fError);
    messaging.infoMessage(`More information found in scraper-error.log.`);
});


function scrapePage(pageURL) {
    scrapeIt(`${siteRoot}/${pageURL.url}`, {
        title: "title",
        price: "h1 .price",
        imgURL: {
            selector: "img",
            attr: "src"
        }
    }).then(({ data, response }) => {
       const scrapeResult = {
           Title: data.title,
           Price: data.price,
           ImageURL: data.imgURL,
           URL: `${siteRoot}/${pageURL.url}`,
           Time: formattedTime
       };
       shirtsResults.push(scrapeResult);
    }).catch(function(err) {
        let fError = "This website is currently unavailable.";
        writeErrorLog(fError, err);
        messaging.errorMessage(fError);
        messaging.infoMessage(`More information found in scraper-error.log.`);
    });
}
