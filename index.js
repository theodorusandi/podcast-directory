const puppeteer = require("puppeteer");
const http = require("http");

let episodeLinks;

const run = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(
        "https://www.podbean.com/podcast-detail/d4un8-57595/JavaScript-Jabber-Podcast"
      );
      episodeLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".items a.title")).map(
          (item) => ({
            url: item.getAttribute("href"),
            text: item.innerText,
          })
        );
      });
      browser.close();
      return resolve(episodeLinks);
    } catch (e) {
      return reject(e);
    }
  });
};


const server = http.createServer((req, res) => {
  run()
  .then(data => {
    res.writeHead(200, { "Content-Type": 'application/json' });
    res.write(JSON.stringify(data));
    res.end();
  })
  .catch(err => {
    console.error(err);
  });

})

server.listen(5000);