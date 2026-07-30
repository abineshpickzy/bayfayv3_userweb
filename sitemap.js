const express = require("express");
const router = express.Router();
const HttpRequest = require('request')
const js2xmlparser = require("js2xmlparser");
const moment = require("moment");
const fs = require('fs');
require('dotenv').config();

/**
 * It generates a standard sitemal.xml for SEO purposes
 */
router.get("/", async function(req, res, next) {

    try {
        //our records to index
        const records = await getRecordsFromDataSource();
        var siteRecord = JSON.parse(records.body);

        const collection = [];
        let today = moment();
        today = today.format("YYYY-MM-DD");
        //add site root url
        const rootUrl = {};
        rootUrl.loc = "https://www.bayfay.com/";
        rootUrl.lastmod = today;
        rootUrl.changefreq = "daily";
        rootUrl.priority = "1.0";
        rootUrl["image:image"] = {
            "image:loc": "s://www.bayfay.com/default-image.jpg",
            "image:caption":
                "test",
        };
        // collection.push(rootUrl);
 
        if (siteRecord) {
            //add recipes urls
            for (let i = 0; i < siteRecord.data.length; i++) {
                const url = siteRecord.data[i].url;
                collection.push(url);
            }
        }

        const col = {
            "@": {
                xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
                "xmlns:image": "http://www.google.com/schemas/sitemap-image/1.1",
            },
            url: collection,
        };
        const xml = js2xmlparser.parse("urlset", col);
        // skip writing to file on vercel (read-only filesystem)
        try {
            fs.writeFileSync("./build/sitemap.xml", xml);
        } catch(e) {}
        

        res.set("Content-Type", "text/xml");
        res.status(200);
        res.send(xml);
    } catch (e) {
        next(e);
    }
});
 
/**
 * @return a collection to index (typically we'll get these records from our database)
 */
 async function getRecordsFromDataSource() {
    //these records will have our own structure, we return as they are and later we convert them to the xml standard format
    //so let's just define two records hard-coded

    const getSiteMapData = () => {

        const data = `${process.env.REACT_APP_API_ENDPOINT}product/shop/sitemap`

        const params = {
            url: data,
            method: "GET",
        }
        
        return new Promise((resolve, reject) => {
            HttpRequest(params, (err, data) => {
                    err ? reject(err) : resolve(data)
                    })
            })
    } 

    let data = await getSiteMapData(); 
    return data;
}
 
module.exports = router;