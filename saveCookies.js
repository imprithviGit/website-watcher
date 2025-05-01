const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://termine.staedteregion-aachen.de/auslaenderamt/select2?md=1');
  console.log('⏳ Please manually complete the form in the browser window...');

  process.stdin.setRawMode(true);
  process.stdin.resume();
  console.log('🔵 Press any key to save cookies...');
  await new Promise(resolve => process.stdin.once('data', resolve));

  const cookies = await page.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));

  console.log('✅ Cookies saved to cookies.json');
  await browser.close();
  process.exit();
})();
