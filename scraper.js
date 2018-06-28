'use strict';

const scrapeIt = require("scrape-it");
/*
scrapeIt("http://shirts4mike.com/shirts.php", {
   title: "title"
}, (err,  data ) => {
    console.log(data);
}) */

scrapeIt("https://ionicabizau.net", {
    // Fetch the articles
    articles: {
        listItem: ".article"
    }
 
}, (err,  data ) => {
   // console.log(err || data)

   console.log(data);
})