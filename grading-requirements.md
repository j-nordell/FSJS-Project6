# Grading Requirments

## Meets Expectations

---

### Command Line Interface and Dependency Management

- [x] Project includes a `package.json` file containing dependencies to run `node scraper.js`
- [x] Running `npm install` installs relevant dependencies

### Folder Generation

- [x] Program creates one `data` folder if that folder doesn't already exist. If the folder does exist, the program does nothing.

### Research npm packages

- [x] Chosen scraping and CSV packages meet the following requirements on npm:
  - [x] 1,000 downloads
  - [x] Updated in the last 6 months

### Crawling

- [x] The project uses the `http://shirts4mike.com/shirts.php` URL as an entry point to look through the links on the page to find 8 shirts

### Scraping and Saving Data

- [x] Project scrapes the product title, price, image and url, and all information is correct and in the correct place
- [x] A CSV is successfully saved to the `data` folder in this format: "YYYY-MM-DD.csv", e.g. "2016-12-30.csv"
- [x] Column headers are in this order: Title, Price, ImageURL, URL, Time

### Overwriting Data

- [x] If the script is run twice, the program overwrites the data. The file coontains the data from the second call.

### Error Handling

- [x] The program displays a human-friendly error (not just the original error code) when it cannot connect to `http://shirts4mike.com`

## Exceeds Expectations

---

### Command Line Interface and Dependency Management (exceeds)

- [x] The `scraper.js` file can be run with the `npm start` command

### Error Handling (exceeds)

- [x] Program logs errors in a `scraper-error.log` file
- [x] New errors append to the end of the file with a timestamp, e.g. `[Tue Feb 16 2016 13:00:55 GMT-0800 (PST) <error message>]`