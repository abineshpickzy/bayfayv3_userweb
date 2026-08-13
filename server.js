const express = require("express");
const app = express();
const axios = require("axios");
const HttpRequest = require('request')
const sitemapRouter = require("./sitemap");
const fs = require('fs');
require('dotenv').config();

app.use(express.static(__dirname + "/build"));

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

// directory path
const jsDir = __dirname + '/build/static/js/';
const cssDir = __dirname + '/build/static/css/';
let jsFiles=[], cssFiles = [];

// Default metadata
const _title = "Order Food, Groceries, Vegetables and Meat on BayFay, best home delivery service. Order from any nearby shops";
const _description = "Order food online from restaurants and get it delivered. Serving in Bangalore, Hyderabad, Delhi, Gurgaon, Nagpur, Jaipur, Coimbatore, Chandigarh, Ahemdabad, Visakhapatnam, Lucknow, Noida, Mumbai, Pune, Indore, Kochi, Kolkata, Nagercoil and Chennai. Order Pizzas, Burgers, Biryanis, Desserts..";
const _keywords = "restaurants, order food, order Groceries, order Meat, order online, order food online, food, delivery, food delivery, home delivery, fast, hungry, quickly, offer, discount, takeaway, cuisine, pizza, burger, biryani, dessert, juice, dosa, bangalore, visakhapatnam, nagpur, bengaluru, delhi, gurgaon, ncr, noida, lucknow, hyderabad, mumbai, jaipur, bombay, chennai, pune, kolkata, ahemdabad, kochi, coimbatore, nagercoil, pizza hut, mcd, mcdonalds, dominos, haagen dazs, baskin robbins, papa johns, kfc, haldiram, breakfast, lunch, dinner, snacks, restaurants near me, Aashirvaad, Saffola, Fortune, Nestle, Amul, Mother Dairy, Coke, Pepsi, Bisleri, Colgate, Patanjali, Dabur, Surf Excel, Maggi, Vim, Haldiram's, Kellogg’s, Nescafe, Pampers";
const _image_url = "https://www.bayfay.com/icons/images/icon-200x200.png";
const _url = "https://www.bayfay.com";

let default_meta = {
      "title": _title,
      "description": _description,
      "keywords": _keywords,
      "icon_url": _image_url,
      "web_url": _url,
      "rating": 0
}

// Build the real, current-page URL (fixes canonical tag bug)
const getFullUrl = (req) => {
  console.log(req.protocol + '://' + req.get('host') + req.originalUrl )
  
  return req.protocol + '://' + req.get('host') + req.originalUrl
  
  };

// list all files in the directory
try {
    let files = fs.readdirSync(jsDir);
    files.forEach(file => {
        (file.endsWith('.js') && !file.endsWith('.js.map') && !file.endsWith('.txt')) && jsFiles.push(file)
    });

    files = fs.readdirSync(cssDir);
    files.forEach(file => {
        (file.endsWith('.css') && !file.endsWith('.css.map')) && cssFiles.push(file)
    });

} catch (err) {
    console.log(err);
}

app.set('trust proxy', true);

// app.use((req, res, next) => {

//   const host = req.header('host');
//   if (host.match(/^www\..*/i) || host.match(/^devweb\..*/i) || host === '0.0.0.0:4000') {
//       next();
//   } else {
//       res.redirect(301, `${req.protocol}://www.${host}${req.url}`);
//   }
// });

app.use("/sitemap", sitemapRouter);

app.get("/", (req, res) => {
    res.render("index.ejs", {...default_meta, web_url: getFullUrl(req), jsFiles, cssFiles});
});

app.get('/:shopId', async (req, res) =>{
 
    const getMetaData = (shop_param) => {
      
      const data = `${process.env.REACT_APP_API_ENDPOINT}product/view/metadata`
      
      const params = {
          url: data,
          method: "POST",
          json: {
              param: shop_param,
              device_os: "mac",
              source: "browser",
              "deliveryLocation":{
                type: "Point",
                coordinates: [80.2047,12.9880]
              }
          }
      }
      
      return new Promise((resolve, reject) => {
            HttpRequest(params, (err, data) => {
                    err ? reject(err) : resolve(data)
                    })
            })
    } 

    try {

      if (req.params.shopId && req.params.shopId == "home") {
          res.render("index.ejs", {...default_meta, web_url: getFullUrl(req), jsFiles, cssFiles}  );
          return;
      } else 
      if (req.params.shopId && req.params.shopId == "terms") {
          let tersmMetaData = await getTermsMeta()
          res.render("index.ejs", {...tersmMetaData, web_url: getFullUrl(req), jsFiles, cssFiles}  );
          return;
      } else       
      if (req.params.shopId && req.params.shopId == "cancellation") {
          let cancellationMeta = await getCancellationMeta()
          res.render("index.ejs", {...cancellationMeta, web_url: getFullUrl(req), jsFiles, cssFiles}  );
          return;
      } else       
      if (req.params.shopId && req.params.shopId == "merchant-policy") {
          let merchantPolicy = await getMerchantPolicy()
          res.render("index.ejs", {...merchantPolicy, web_url: getFullUrl(req), jsFiles, cssFiles}  );
          return;
      } else       
      if (req.params.shopId && req.params.shopId == "privacy") {
          let privacyPolicy = await getPrivacyPolicy()
          res.render("index.ejs", {...privacyPolicy, web_url: getFullUrl(req), jsFiles, cssFiles}  );
          return;
      } else
      if (req.params.shopId && req.params.shopId == "merchant-help") {
          let merchantHelp = await getMerchantHelp()
          res.render("index.ejs", {...merchantHelp, web_url: getFullUrl(req), jsFiles, cssFiles}  );
          return;
      } else
      if (req.params.shopId && req.params.shopId == "api") {
          let apiMeta = await getAPIMeta()
          res.render("index.ejs", {...apiMeta, web_url: getFullUrl(req), jsFiles, cssFiles}  );
          return;
      } else       
      if (req.params.shopId && req.params.shopId == "partner") {
          let partnerMeta = await getPartnerMeta()
          res.render("index.ejs", {...partnerMeta, web_url: getFullUrl(req), jsFiles, cssFiles}  );
          return;
      } else       
      if (req.params.shopId && req.params.shopId == "faq") {
          let faqMeta = await getFaqMeta()
          res.render("index.ejs", {...faqMeta, web_url: getFullUrl(req), jsFiles, cssFiles}  );
          return;
      } else
      if (req.params.shopId && req.params.shopId == "help") {
          let helpMeta = await hetHelpMeta()
          res.render("index.ejs", {...helpMeta, web_url: getFullUrl(req), jsFiles, cssFiles}  );
          return;
      } else
      if (req.params.shopId && req.params.shopId == "about-us") {
          let aboutUsMeta = getAboutUsMeta()
          res.render("index.ejs", {...aboutUsMeta, web_url: getFullUrl(req), jsFiles, cssFiles}  );
          return;
      } else 
      if (req.params.shopId && req.params.shopId == "data") {
          let deleteAccountMeta = getDeleteAccountMeta()
          res.render("index.ejs", {...deleteAccountMeta, web_url: getFullUrl(req), jsFiles, cssFiles}  );
          return;
      } else
      if (!req.params.shopId) {
          res.render("index.ejs", {...default_meta, web_url: getFullUrl(req), jsFiles, cssFiles});
          return
      }

      let response = await getMetaData(req.params.shopId);
      if (response.body.data) {
        var fullUrl = req.protocol + 's://' + req.get('host') + req.originalUrl + '/';
        response.body.data.web_url = fullUrl;
        res.render("index.ejs", {...response.body.data, jsFiles, cssFiles}  );
      } else {
        res.render("index.ejs", {...default_meta, web_url: getFullUrl(req), jsFiles, cssFiles});
      }
      return;
    } catch (e) {
        console.log(e)
        res.render("index.ejs", {...default_meta, web_url: getFullUrl(req), jsFiles, cssFiles});
    }
});

app.get("*", async (req, res, next) => {
    res.render("index.ejs", {...default_meta, web_url: getFullUrl(req), jsFiles, cssFiles});
});

// For local development
if (require.main === module) {
    app.listen(process.env.EXPRESS_PORT, process.env.EXPRESS_HOST, function (err) {
        if (err) {
            process.exit(10)
        }
        console.log("React js Server Deployed on http://" + process.env.EXPRESS_HOST + ':' + process.env.EXPRESS_PORT)
    })
}

module.exports = app;

// Terms of use
const getTermsMeta = () => {

      let json = {
        "title": "Customer terms of use",
        "description": "Welcome to BayFay. By browsing, downloading, accessing or using this mobile application, you will be subject to the rules, guidelines, policies, terms and conditions",
        "keywords": _keywords,
        "icon_url": _image_url,
        "web_url": _url,
        "rating": 0
      }
      return json;
}

// Cancellation
const getCancellationMeta = () => {

      let json = {
        "title": "Customer Cancellation",
        "description": "Once the order is accepted, you can cancel it by contacting the BayFay Support team, and charges may apply based upon the product category for such cancellations.",
        "keywords": _keywords,
        "icon_url": _image_url,
        "web_url": _url,
        "rating": 0
      }
      return json;
}

// Merchant Policy
const getMerchantPolicy = () => {

  let json = {
    "title": "Merchant terms of use",
    "description": "This document is an electronic record in terms of Information Technology Act, 2000 and rules there under as applicable and the amended provisions pertaining..",
    "keywords": _keywords,
    "icon_url": _image_url,
    "web_url": _url,
    "rating": 0
  }
  return json;
}

// Privacy Policy
const getPrivacyPolicy = () => {

  let json = {
    "title": "Customer Privacy Policy",
    "description": "This privacy policy governs data and information collected by BayFay. It’s a legal binding document between you and BayFay. This term of this privacy policy will be effective..",
    "keywords": _keywords,
    "icon_url": _image_url,
    "web_url": _url,
    "rating": 0
  }
  return json;
}

// merchant-help
const getMerchantHelp = () => {

  let json = {
    "title": "Merchant Help",
    "description": "Select your store type and store category. If your shop category is not available in the dropdown then select Others and provide a brief description of your shop (For other category shops, our sales team will contact you and help you to setup the store)...",
    "keywords": _keywords,
    "icon_url": _image_url,
    "web_url": _url,
    "rating": 0
  }
  return json;
}

// api
const getAPIMeta = () => {

  let json = {
    "title": "BayFay Store Admin inventory update API",
    "description": "Create BayFay Setting page in the POS software....",
    "keywords": _keywords,
    "icon_url": _image_url,
    "web_url": _url,
    "rating": 0
  }
  return json;
}

// Partner
const getPartnerMeta = () => {

  let json = {
    "title": "Partner with us and Start your digital store or wholesale store or Delivery Agency",
    "description": "Start BayFay delivery agency in your location (up to 10km) and help nearby merchants and customers in this pandemic time..",
    "keywords": "Partner with BayFay, Digital store, seller app, online selling, home delivery, e-commerce website, sell nearby customers, online retail shop",
    "icon_url": _image_url,
    "web_url": _url,
    "rating": 0
  }
  return json;
}

// faq
const getFaqMeta = () => {

  let json = {
    "title": "Customer / Buyer FAQ",
    "description": "How can I create an account in BayFay Customer app?..Please visit www.bayfay.com/app and follow the steps to Signup.",
    "keywords": _keywords,
    "icon_url": _image_url,
    "web_url": _url,
    "rating": 0
  }
  return json;
}

// help
const hetHelpMeta = () => {

  let json = {
    "title": "Here are the solutions for the general queries!",
    "description": "Start BayFay delivery agency in your location (up to 10km) and help nearby merchants and customers in this pandemic time..",
    "keywords": _keywords,
    "icon_url": _image_url,
    "web_url": _url,
    "rating": 0
  }
  return json;
}

// About Us
const getAboutUsMeta = () => {
  let json = {
    "title": "About Us - BayFay, Hyper Local Commerce Platform",
    "description": "BayFay is a hyper local commerce platform connecting customers with nearby shops for food, groceries, meat and more. Order from any nearby shops and get it delivered.",
    "keywords": _keywords,
    "icon_url": _image_url,
    "web_url": _url,
    "rating": 0
  }
  return json;
}

// Delete Account
const getDeleteAccountMeta = () => {
  let json = {
    "title": "Delete Account - BayFay",
    "description": "Request to delete your BayFay account and associated personal information.",
    "keywords": _keywords,
    "icon_url": _image_url,
    "web_url": _url,
    "rating": 0
  }
  return json;
}