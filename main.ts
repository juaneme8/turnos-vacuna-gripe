import puppeteer from 'puppeteer';
import notifier from 'node-notifier'

const PAGE_URL = `https://covid.buenosaires.gob.ar/AgendarTramite?idPrestacion=3809&tokensession=B5rb-PsUpe5ahNerPyAQ64sYh1OespCFDFgy7rbclqc&flow=primeros`;
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
      console.log(`No hay turnos todavía :(`);
    }

    await browser.close();
  } catch (e) {
    console.log('############');
    console.log(e);
  }
}

main();

setInterval(() => {
  main();
}, 1000 * 60 * 5);