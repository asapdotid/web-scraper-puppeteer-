'use strict'

require('dotenv').config()

const path = require('path');
const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const download = require('download');

const checkDir = require('./function/checkDir').dirCheck;

const pathDir = path.join(__dirname, '..') + '/' + process.env.PATH_FILE + '/' + process.env.PATH_VIDEO;
const fixPath = path.normalize(pathDir);
const pathFull = path.normalize(pathDir + '/');

var scrape = async () => {
	// Actual Scraping goes Here...

	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();

	await page.goto('https://coursehunters.net/course/ultimate-laravel-kurs-2018-paypal-webshop-restful-api');

	const result = await page.evaluate(() => {
	    let data = []; // Create an empty array that will store our data
	    let elements = document.querySelectorAll('li.lessons-list__li'); // Select all Products

	    for (var element of elements){ // Loop through each proudct
	        let str = element.childNodes[3].innerText; // Select the title
	        let strArry = str.split(" ");
	        strArry[0] = 'lesson';
	        let title = strArry.join(' ');

	        let video = element.querySelector("link[itemprop='contentUrl']").href; // Select the url link

	        data.push({title, video}); // Push an object with the data onto our array
	    }

	    return data; // Return our data array
	});

	browser.close();
	return result; // Return the data
  	// Return a value
};

scrape().then((value) => {
    for (var result in value) {
        download(value[result]['video']).then(data => {
            // await checkDir(fixPath);
            fs.outputFileSync(pathFull + value[result]['title'] + '.mp4', data);
        }).then(() => {
            console.log('Download done..');
        });
    }
});