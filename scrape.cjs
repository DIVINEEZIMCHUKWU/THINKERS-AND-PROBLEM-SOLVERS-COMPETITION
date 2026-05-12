const fetch = require('node-fetch');

async function scrape() {
  const res = await fetch('https://www.toyota-dreamcarart.com/district/');
  const text = await res.text();
  console.log(text);
}
scrape();
