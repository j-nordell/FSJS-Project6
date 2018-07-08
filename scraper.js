
const fs = require("fs");
const scrapeIt = require("scrape-it");
const siteRoot = `http://shirts4mike.com`;
const mainPage = `http://shirts4mike.com/shirts.php`;
const dataDirectory = "./data";


scrapeIt(mainPage, {
    title: "title",
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
    scrapeIt(`${siteRoot}/${pageURL.url}`, {
       price: "h1 .price"
    }).then(({ data, response }) => {
        console.log(data.price);
    })
}