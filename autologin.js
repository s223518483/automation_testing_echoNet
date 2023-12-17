const puppeteer = require('puppeteer');
//let captcha = require('./autocaptcha');

async function autologin() {
    const browser = await puppeteer.launch({ dumpio: true, headless: false});
    const page = await browser.newPage();
    const browserWSEndpoint = browser.wsEndpoint();

    let data = "";
    let username = "abcdef";
    let password = "1234567890";
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

        //console.log('RESPONSE:', { url, status, statusText, headers, data });
    })

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

    await page.type('input[name="username"]', username);

    await page.type('input[name="password"]', password);

    await page.on('dialog', async dialog => {
        await dialog.accept();
    });

    await page.click('#login-form-submit');

    //await page.waitForNavigation();

    //await browser.close();
    
}

autologin();
//module.exports = {autologin};