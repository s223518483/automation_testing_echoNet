const puppeteer = require('puppeteer');

async function autoregister() {
    const browser = await puppeteer.launch({ dumpio: true, headless: false,  args: ['--disable-features=site-per-process']});
    const page = await browser.newPage();
    const browserWSEndpoint = browser.wsEndpoint();

    let data = "";
    let name = "abcdef";
    let mail = "abcdef@deakin.edua.au";
    let pass = "1234567890";
    let DOB = "01/01/2000";
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
    

    const registerButton = await page.$('.screen-user li:nth-child(2)');

    await registerButton.click();
    
    await page.waitForSelector('#signup-form', {visible: true});

    let user_selector = 'input[name="username"]';
    await page.focus(user_selector);
    await page.evaluate((user_selector) => document.querySelector(user_selector).click(), user_selector);
    await page.waitForSelector(user_selector, visible=true);
    await page.type(user_selector, name);


    let email_selector = 'input[placeholder="Enter Email"]';
    await page.focus(email_selector);
    await page.evaluate((email_selector) => document.querySelector(email_selector).click(), email_selector);
    await page.waitForSelector(email_selector, visible=true);
    await page.keyboard.type(email_selector, mail);


    

    await page.type('input[name="confirmpassword"]', pass);

    await page.type('input[name="password"]', pass);

    await page.waitForNavigation();

    await page.click('#next-button');

    await page.waitForNavigation();

    await page.select('select[name="roles"]', 'Admin');

    await page.select('select[name="gender"]', 'MALE');

    await page.select('select[name="DoB"]', DOB);

    await page.click('#next-button');

    //await page.waitForNavigation();

    //await browser.close();
    
}

autoregister();
//module.exports = {autologin};