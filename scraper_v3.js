const axios = require('axios');
const cheerio = require('cheerio');
 


async function scrape(input_urls) {
  const results = [];

  for (const url of input_urls) {
    //extract the ticker from the url
    const ticker = url.split('/')[5].split('.')[0];
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const rows = $('tr');

      rows.each((i, row) => {
        const label = $(row).find('td.indent').text().trim();
        const value = $(row).find('td.deltaType-positive').text().trim();

        if (label.toLowerCase().includes('pretax margin')) {
          results.push({
            url,
            ticker,
            label,
            value,
          });
        }
      });
    } catch (error) {
      console.log(`Error: ${url}: ${error.message}`);
    }
  }
// create a string of each result and save it to an array
const resultsString = results.map((result) => {
  return `${result.ticker} ${result.label} ${result.value}`;
});
  return resultsString;

}



module.exports = scrape;

