
const fs = require("fs");
const Json2csvParser = require('json2csv').Parser;
const scrapeIt = require("scrape-it");
const siteRoot = `http://shirts4mike.com`;
const mainPage = `http://shirts4mike.com/shirts.php`;
const dataDirectory = "./data";
const timeNow = new Date();
const formattedTime = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`;
const formatedDay = `${timeNow.getFullYear()}-${timeNow.getMonth() + 1}-${timeNow.getDate()}`;
const fields = ["Title", "Price", "ImageURL", "URL", "Time"];
let shirtsResults = [];

scrapeIt(mainPage, {
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
    if (!fs.existsSync(dataDirectory)){
        fs.mkdirSync(dataDirectory);
    }

    for(let shirt of data.shirts) {
        scrapePage(shirt);
    }

    setTimeout(() => {
        try {
            const parser = new Json2csvParser({ fields });
            const csv = parser.parse(shirtsResults);
            fs.writeFile(`${dataDirectory}/${formatedDay}.csv`, csv, (err) => {
                if(err) {
                    console.log(`Could not write to file: ${err.path}`);
                }
            });
        } catch (err) {
            console.log(err);
        };
    }, 5000);
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
    });
}


