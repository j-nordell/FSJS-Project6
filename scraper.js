

const scrapeIt = require('scrape-it');
const mainPage = `http://shirts4mike.com/shirts.php`;



scrapeIt(mainPage, {
    title: "title"
    }
).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`);
    console.log(data);
})