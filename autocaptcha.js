const puppeteer = require('puppeteer');
//const fs = require('fs');

async function getConsoleOutput() {
    const browser = await puppeteer.launch({ dumpio: true, headless: false});
    const page = await browser.newPage();
    let data = "No Captcha";
    
    page
    .on('response', async response =>{
        
        const request = response.request();
        const url = request.url();
        const status = response.status();
        const statusText = response.statusText();
        const headers = response.headers();
        if (url.endsWith('captcha')) {
            let body = await response.text();
            body = body.match(/"text":"(.*?)"/);
            data = body[1];
        }

        console.log('RESPONSE:', { url, status, statusText, headers, data });
    })
    .on('pageerror', ({ message }) => console.log(message))
    /* .on('console', async msg => {
        const args = await msg.args();
        args.forEach(async arg => {
            //const value = await arg.jsonValue();
           // const stringValue = JSON.stringify(value);
            //console.log('CONSOLE LOG:', stringValue);
        });
    }) */

    await page.goto('http://localhost:8080/login');
    

    const loginButton = await page.$('.screen-user li:first-child');

    await loginButton.click();

    await page.waitForSelector('#login-form-checkbox', {visible: true})

    await page.evaluate(() => {
    document.querySelector('#login-form-checkbox').click();
    });

    await page.waitForSelector('#login-form-captcha', {visible: true})

    await page.evaluate(() => {
    document.querySelector('#login-form-txt').click();
    });

    await page.type('#login-form-txt', data);

    await page.evaluate(() => {
        Array.from(document.querySelectorAll('button')).find(el => el.textContent === ' Verify').click();
    });

    await page.waitForNavigation();

    await browser.close();
}

getConsoleOutput();