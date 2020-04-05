const puppeteer = require('puppeteer');
var moment = require('moment');
var texttable = require('text-table');
var tableify = require('tableify');
var config = require('./myconfig.js');//please copy and fill in the fields in config.js and save as myconfig.js
var nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

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
    
      var fetchtime = moment.now();

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
        products[ind].time = fetchtime;
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

function mailreport(text){
    var transporter = nodemailer.createTransport(config.mailAccount);
    config.mailOptions.text = text;
    transporter.sendMail(config.mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function mailreportoauth(text, html){
    //setup oauth client
    const oauth2Client = new OAuth2(
        config.mailAccountOAuth.auth.clientId,
        config.mailAccountOAuth.auth.clientSecret,
        'https://developers.google.com/oauthplayground',
    );
    oauth2Client.setCredentials({
        refresh_token: config.mailAccountOAuth.auth.refreshToken
    })
    //get and set AccessToken
    config.mailAccountOAuth.accessToken = oauth2Client.getAccessToken();
    var transporter = nodemailer.createTransport(
        config.mailAccountOAuth
    )
    config.mailOptions.text = text;
    config.mailOptions.html = html;
    transporter.sendMail(config.mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function generatereport(prefixstr, foundproduct){
    var ret = {};
    var foundproducttable;
    if(foundproduct.length > 0){
        //found matched products
        foundproducttable = foundproduct.map((ele)=>{
            return [ele.name, ele.pricestr, ele.timestr]
        })
        table = texttable(foundproducttable);
        htmltable = tableify(foundproducttable);
    }else{
        //No products matched
        table = 'No products matched';
        htmltable = 'No products matched';
    }
    //construct report
    ret.txtreport = `
        ${prefixstr} \n
        ${table}`;
    ret.htmlreport  = `<html><body>
        ${prefixstr} <br/>
        ${htmltable}
        </body></html>`;
    return ret;
}

(async () => {
    var report, prefixstr;
    var beginat = moment.now();
    prefixstr = `Start to search products at ${moment(beginat).format("YYYY-MM-DD HH:mm:ss")}`;
    var products = await fetchapplerefusbishproducts(link, networkidletimeout);
    var foundproducts = findproducts(products, /12\.9-inch\ iPad\ Pro/gm);
    report = generatereport(prefixstr, foundproducts);
    //mailreportoauth(report.txtreport, '');
    mailreportoauth('', report.htmlreport);
})();