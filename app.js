const puppeteer = require('puppeteer');
var moment = require('moment');

const link = 'https://www.apple.com/hk/shop/refurbished/ipad';
const networkidletimeout = 30000;

async function fetchapplerefusbishproducts(inlink, intimeout){
    const browser = await puppeteer.launch(
        {headless: false});
      const page = await browser.newPage();
      await page.goto(inlink, {
          waitUntil: 'networkidle2',
          timeout: intimeout
      } );
    
      var products = await page.evaluate(()=>{
        return Array.from(document.querySelectorAll('#refurbished-category-grid > div > div.as-gridpage.as-gridpage-pagination-hidden > div.as-gridpage-pane > div.as-gridpage-results > ul > li')).map((ele)=>{
            let obj = {};
            obj.name = ele.querySelectorAll('.as-producttile-title')[0].textContent    
            obj.pricestr = ele.querySelectorAll('.as-producttile-currentprice')[0].textContent;
            obj.price = Number(obj.pricestr.replace(/[^0-9]+/gm,''));
            return obj;
            })
      })
    
      products.forEach((ele,ind)=>{
        products[ind].time = moment.now();
        products[ind].timestr = moment(products[ind].time).format('YYYY-MM-DD HH:mm:ss');
      })
    
      await browser.close();
      return products;
}

(async () => {
    var products = await fetchapplerefusbishproducts(link, networkidletimeout);
    console.log(products)
})();