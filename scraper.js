
const fs = require("fs");
const http = require("http");
const messaging = require("./messaging.js");
const Json2csvParser = require("json2csv").Parser;
const scrapeIt = require("scrape-it");
const siteRoot = `http://shirts4mike.com`;
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

function writeErrorLog(friendlyError, code) {
    fs.appendFile('./scraper-error.log',`${timeNow}\t${friendlyError}\tStatus code: ${code}\n`, function (err) {
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
     
    if(response.statusCode < 200 || response.statusCode > 299) {
        let friendly = checkStatusCode(response.statusCode);
        let responseError = new Error(friendly);
        responseError.statusCode = response.statusCode;
        throw responseError;
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
    writeErrorLog(err.message, err.statusCode);
    messaging.errorMessage(err.message);
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
       if(response.statusCode < 200 || response.statusCode > 299) {
            let friendly = checkStatusCode(response.statusCode);
            let responseError = new Error(friendly);
            responseError.statusCode = response.statusCode;
            throw responseError;
        }
       shirtsResults.push(scrapeResult);
    }).catch(function(err) {
        writeErrorLog(err.message, err.statusCode);
        messaging.errorMessage(err.message);
        messaging.infoMessage(`More information found in scraper-error.log.`);
    });
}

// Because scrape-it does not handle these blocks of error codes this logic had to be put in
function checkStatusCode(codeNumber) {
    let friendlyMessage = "";
    switch(codeNumber) {
        case 401:
            friendlyMessage = "You are not authorized to use this site without first authenticating";
            break;
        case 403:
            friendlyMessage = "Access to this URL is forbidden";
            break;
        case 404:
            friendlyMessage = "The resource was not found at this address";
            break;
        case 410:
            friendlyMessage = "The resource you requested has been removed";
            break;
        case 500:
            friendlyMessage = "Unexpected error from the server";
            break;
        case 503:
            friendlyMessage = "The service is temporarily unavailable";
            break;
        case 550:
            friendlyMessage = "The account you are logged in with doesn't have permission to use this URL";
            break;
        default:
            friendlyMessage = "Bummer! Something went wrong but we're not sure what!";
    }
    return friendlyMessage;
}