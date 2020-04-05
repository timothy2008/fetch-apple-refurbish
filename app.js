const puppeteer = require('puppeteer');
var moment = require('moment');
var texttable = require('text-table');

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
    
      var timenow = moment.now();

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
        products[ind].time = timenow;
        products[ind].timestr = moment(products[ind].time).format('YYYY-MM-DD HH:mm:ss');
      })
    
      await browser.close();
      return products;
}

function findproducts(inproductsmap, reg){
    var matchedproducts = [];
    inproductsmap.forEach((ele)=>{
        var ind = ele.name.search(reg);
        if(ind != -1)
            matchedproducts = matchedproducts.concat(ele);
    });
    return matchedproducts
}

(async () => {
    var products = await fetchapplerefusbishproducts(link, networkidletimeout);
    var foundproduct = findproducts(products, /12\.9-inch\ iPad\ Pro/gm);
    if(foundproduct.length > 0){
        var foundproducttable = foundproduct.map((ele)=>{
            return [ele.name, ele.pricestr, ele.timestr]
        })
        var t = texttable(foundproducttable);
        console.log(t)
    }else{
        console.log("No products matched.")
    }
})();