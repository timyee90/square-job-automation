const puppeteer = require('puppeteer');
const { sleep } = require('./utils');
const { promisifyAll } = require('bluebird');
const fs = promisifyAll(require('fs'));
const {
  firstName,
  initial,
  lastName,
  email,
  phone,
  linkedin,
  website,
  message,
  fileLocation,
  gender,
  ethnicity,
} = require('./secrets.js');

(async () => {
  const waitOptions = { waitUntil: 'networkidle0' };
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=2000,800'],
    defaultViewport: null,
  });
  let page = await browser.newPage();

  await page.setDefaultTimeout(15000);

  // --- find relevant job posts ---

  const BASE_URL =
    'https://careers.squareup.com/us/en/jobs?role%5B%5D=Data%20Science%20and%20Machine%20Learning&role%5B%5D=Software%20Engineering';

  await page.goto(BASE_URL, waitOptions);

  let jobs = await page.evaluate(() => {
    const exclude = /manager/gi;
    let roles = document.querySelector(
      '#main-content > div > section:nth-child(2) > div > div:nth-child(5) > div'
    ).children;
    const jobs = [...roles].map(
      (item) => item.children[0].children[0].children[0].href
    );

    roles = document.querySelector(
      '#main-content > div > section:nth-child(2) > div > div:nth-child(18) > div'
    ).children;
    jobs.push(
      ...[...roles]
        .filter(
          (item) =>
            !item.children[0].children[0].children[0].innerText.match(exclude)
        )
        .map((item) => item.children[0].children[0].children[0].href)
    );
    return jobs;
  });

  await page.close();

  // --- apply to relevant jobs ---

  for (const url of jobs) {
    const applied = await fs
      .readFileAsync('./applied.txt', 'utf-8')
      .then((data) => JSON.parse(data));

    if (applied.indexOf(url) > -1) continue;

    // --- first page ---

    page = await browser.newPage();
    await page.setDefaultTimeout(10000);

    await page.goto(url, waitOptions);

    await page.click('#st-apply');
    await page.waitForSelector('#first-name-input', waitOptions);

    await page.type('#first-name-input', firstName);
    await page.type('#last-name-input', lastName);
    await page.type('#email-input', email);
    await page.type('#confirm-email-input', email);
    await page.type('#phone-number-input', phone);
    await page.type('#linkedin-input', linkedin);
    await page.type('#website-input', website);
    await page.type('#hiring-manager-message-input', message);

    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click(
        'body > oc-app-root > main > div > div > oc-form-root > oc-oneclick-form > div > oc-resume-upload > div > div > div > div > div > oc-file-upload-button > div > button'
      ),
    ]);

    await fileChooser.accept([fileLocation]);

    await page.click(
      'body > oc-app-root > main > div > div > oc-form-root > oc-oneclick-form > oc-nav-first-page > footer > div > div:nth-child(2) > button'
    );

    // --- next page ---

    await page.waitForSelector(
      'body > div.topbar.flex.flex-row.flex-jc-center > div > div > div.topbar-job-details > p.margin-vertical--s.flex.flex-ai-center',
      waitOptions
    );

    const jobLocation = await page.evaluate(() => {
      const loc = document.querySelector(
        'body > div.topbar.flex.flex-row.flex-jc-center > div > div > div.topbar-job-details > p.margin-vertical--s.flex.flex-ai-center'
      ).innerText;
      return loc;
    });
    console.log(`applying to location: `, jobLocation);

    if (jobLocation.match(/united states/gi)) {
      await page.waitForSelector(
        '#questions-form > sr-base-select-question > sr-select-question > div > select > option:nth-child(2)',
        waitOptions
      );
      await page.waitForSelector(
        '#questions-form > sr-checkbox-question > div > label > span',
        waitOptions
      );

      await page.select(
        '#questions-form > sr-base-select-question > sr-select-question > div > select',
        '669f55a3-07d2-4ed9-a6e9-2b2ae3a93f2b'
      );

      await page.click(
        '#questions-form > sr-radio-question:nth-child(4) > fieldset > label:nth-child(2) > span'
      );

      await page.click(
        '#questions-form > sr-radio-question:nth-child(5) > fieldset > label:nth-child(3) > span'
      );

      await page.click(
        '#questions-form > sr-checkbox-question > div > label > span'
      );

      await page.select(
        '#questions-form > sr-eeo-question > div > div > select:nth-child(1)',
        gender
      );

      await page.select(
        '#questions-form > sr-eeo-question > div > div > select.element.element--select.margin--left--m',
        ethnicity
      );
    } else {
      await page.waitForSelector(
        '#questions-form > sr-base-select-question > sr-select-question > div > select',
        waitOptions
      );

      await page.select(
        '#questions-form > sr-base-select-question > sr-select-question > div > select',
        '669f55a3-07d2-4ed9-a6e9-2b2ae3a93f2b'
      );

      await page.click(
        '#questions-form > sr-radio-question:nth-child(4) > fieldset > label:nth-child(3) > span'
      );

      await page.click(
        '#questions-form > sr-radio-question:nth-child(5) > fieldset > label:nth-child(2) > span'
      );
    }

    await page.click(
      '#questions-form > sr-radio-question:nth-child(6) > fieldset > label:nth-child(3) > span'
    );

    await page.click(
      '#questions-form > sr-radio-question:nth-child(8) > fieldset > label:nth-child(3) > span'
    );

    try {
      const esign = await page.$x(
        '/html/body/oc-app-root/main/div/div/oc-form-root/oc-screening-questions/div/oc-screening-questions-form/div/sr-questions-form/form/sr-textarea-question[2]/div/textarea'
      );
      await esign[0].type(`${firstName} ${initial} ${lastName}`);
    } catch {}

    await page.click(
      'body > oc-app-root > main > div > div > oc-form-root > oc-screening-questions > div > oc-consent > div > div > div > label'
    );

    // --- submit application ---
    await page.click(
      'body > oc-app-root > main > div > div > oc-form-root > oc-screening-questions > oc-nav-screening-questions > footer > div > div:nth-child(2) > button'
    );

    // --- add url to applied.txt ---
    applied.push(url);
    await fs.writeFileAsync('./applied.txt', JSON.stringify(applied), 'utf-8');

    await sleep(5000);

    await page.close();
  }

  browser.close();
})();
