const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const sendAlertEmail = require('./emailer');

const EXPECTED_TEXT = 'Kein freier Termin verfügbar';
const logFile = path.join(__dirname, 'cron-log.txt');
const cookiesPath = path.join(__dirname, 'cookies.json');

function logMessage(message) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

async function checkPage() {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 100,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // required for Railway
  });

  const page = await browser.newPage();
  const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));
  await page.setCookie(...cookies);

  try {
    logMessage('🔄 Navigating to page...');
    await page.goto('https://termine.staedteregion-aachen.de/auslaenderamt/select2?md=1', { waitUntil: 'networkidle2' });
    
    await page.waitForSelector('#header_concerns_accordion-455', { timeout: 10000 });
    await page.click('#header_concerns_accordion-455');
    await page.waitForSelector('#content_concerns_accordion-455', { timeout: 10000 });
    await page.click('#button-plus-286');
    await page.click('#WeiterButton');

    try {
      await page.waitForSelector('#OKButton', { timeout: 10000 });
      await page.click('#OKButton');
      logMessage('✅ OK Button clicked');
    } catch {
      logMessage('⚠️ Modal did not appear');
    }

    try {
      await page.waitForSelector('#WeiterButton', { timeout: 10000 });
      await page.click('#WeiterButton');
    } catch {
      logMessage('⚠️ Final continue button not found');
    }

    const pageContent = await page.content();
    console.log("FINAL URL:", page.url());
    if (!pageContent.includes(EXPECTED_TEXT)) {
      logMessage('❌ Text missing — sending email');
      await sendAlertEmail('🚨 Appointment alert! Check now!');
    } else {
      logMessage('✅ Appointment unavailable (text found)');
    }

  } catch (error) {
    logMessage(`💥 Error: ${error.message}`);
  } finally {
    await browser.close();
    logMessage('🔒 Browser closed');
  }
}

checkPage();
