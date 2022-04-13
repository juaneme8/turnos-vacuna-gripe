import 'dotenv/config';

import puppeteer from 'puppeteer';
import notifier from 'node-notifier';

const PAGE_URL = process.env.PAGE_URL || '';
const SELECTOR = `#no-data > div > div`;

async function main() {
  console.log('Starting...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(PAGE_URL);

    const text = await page.$eval(SELECTOR, e => e.textContent);

    console.log(text?.trim());
    if (text?.trim() !== 'Actualmente no se encuentran turnos disponibles.') {
      notifier.notify({
        title: 'TURNOS PARA VACUNACIÓN',
        message: `Hay turnos para vacunación: ${text}`,
      });
    } else {
      const date = new Date();
      console.log(`${date} - No hay turnos todavía :(`);
    }

    await browser.close();
  } catch (error) {
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;

    console.log(message);
  }
}

main();

setInterval(() => {
  main();
}, 1000 * 60 * 5);
