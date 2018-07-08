
const fs = require("fs");
const scrapeIt = require("scrape-it");
const siteRoot = `http://shirts4mike.com`;
const mainPage = `http://shirts4mike.com/shirts.php`;
const dataDirectory = "./data";
const timeNow = new Date();
const formattedTime = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`;
const formatedDay = `${timeNow.getFullYear()}-${timeNow.getMonth()}-${timeNow.getSeconds()}`;

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
    }
).then(({ data, response }) => {
    if (!fs.existsSync(dataDirectory)){
        fs.mkdirSync(dataDirectory);
    }
 
    for(let shirt of data.shirts) {
        scrapePage(shirt);
    }
})

function scrapePage(pageURL) {
    //let wholeURL = `${siteRoot}/${pageURL.url}`;
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
       }
       console.log(scrapeResult);
    })
}