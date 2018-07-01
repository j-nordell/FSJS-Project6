'use strict';

const scrape = require('website-scraper');
const options = {
  urls: ['http://shirts4mike.com/shirts.php'],
  directory: './data',
};
 

scrape(options, (error, result) => {
    /* some code here */
    console.log(result);
});