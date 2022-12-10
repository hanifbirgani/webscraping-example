const puppeteer = require("puppeteer");
const {getRandomUserAgent} = require("./lib/utils");

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--user-agent=${getRandomUserAgent()}`
        ]
    });
    const page = await browser.newPage();

    await page.setViewport({
        width: 1024,
        height: 768,
        deviceScaleFactor: 1,
    });

    await page.setDefaultTimeout(60000);

    // Number of pages to crawl
    let numberOfPages = 3

    // Items placeholder
    let items = []

    for (let pageNumber = 1; pageNumber <= numberOfPages; pageNumber++) {
        // Open the webpage
        await page.goto(`https://www.webscraper.io/test-sites/e-commerce/static/computers/laptops?page=${pageNumber}`);

        // Wait for the main content
        await page.waitForSelector('.test-site')

        // Grab the items
        let currentPageItems = await page.$$eval('.test-site .thumbnail', results => {
            return results.map((item) => {
                return {
                    'title': item.querySelector('.title').innerText.trim(),
                    'price': item.querySelector('.price').innerText.trim(),
                    'description': item.querySelector('.description').innerText.trim(),
                    'rating': item.querySelector('p[data-rating]').dataset.rating,
                    'image': item.querySelector('img.img-responsive').src
                }
            })
        })

        // Add current page items to the items cache
        items.push(...currentPageItems)
    }

    console.log(items)

    await browser.close();
})();
