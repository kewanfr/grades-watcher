import puppeteer from "puppeteer";
import fs from "fs";
import config from "../config.js";

export default async function getPHPSession(refresh = false) {
  const path = config.PHPSESSION_PAGE;

  // If folder of path doesn't exist, create it.
  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
  }


  if (!refresh && fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path));
      
    return data.PHPSESSID || false;
  }

  const browser = await puppeteer.launch({
    // headless: config.HEADLESS,
  });
  const page = await browser.newPage();

  // Navigate to login page
  await page.goto(
    config.LOGIN_PAGE_URL
  );

  // Wait for the page to load.
  await page.waitForSelector('input[name="username"]');
  await page.waitForSelector('input[name="password"]');

  // Type logins
  await page.type('input[name="username"]', config.login.username);
  await page.type('input[name="password"]', config.login.password);

  // Click button.
  await page.click('button[name="submit"]');

  await page.waitForNavigation();

  // get the PHP session.
  const cookies = await page.cookies();
  const PHPSESSID = cookies.find(
    (cookie) => cookie.name === "PHPSESSID"
  )?.value;

  await browser.close();

  if(PHPSESSID) {
    await fs.writeFileSync(path, JSON.stringify({ PHPSESSID }));
  }

  return PHPSESSID;
}

// if main module, run this code (in ES module)
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Running getPHPSession.js");
  (async () => {
    console.log(await getPHPSession());
  })();
}