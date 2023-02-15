const pup = require('puppeteer');  // para trazer a biblioteca
const { scrollPageToBottom } = require('puppeteer-autoscroll-down')

let list = [];
let j = 1;


(async () => {  //como teremos a dinamica de enviar coisas e esperar é um processo assincrono

    const browser = await pup.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://seminovos.localiza.com/seminovo?map=tipo');

    await page.waitForSelector('.localizaseminovos-newgeolocal-0-x-linkButton'); 

    page.click('.localizaseminovos-newgeolocal-0-x-linkButton')


    await page.waitForTimeout(5000); // teste para scrollar para baixo

    let i = 1
    while (i<3) {
        await scrollPageToBottom(page, { size: 500 })
        await page.waitForTimeout(1000);
        i ++
    }
      
    

    const links = await page.$$eval('.localizaseminovos-product-summary-component-0-x-imageContainer > a', el => el.map(link => link.getAttribute("href")));
    // veja que eles estão sem o começo do site, vamos botar (estavam só como /renault-zoe-2022-ukhemek2oa-49/p')

    
    
    
    for (let i in links) {
        const base = 'https://seminovos.localiza.com/'
        links[i] = base.concat(links[i]);
        

    };

    for (const link of links) {
        try {
        console.log(`SALVANDO ${j}º CARRO`)
        await page.goto(link);

        await page.waitForSelector('.localizaseminovos-store-components-custom-3-x-productBrand');
        const name = await page.$eval('.localizaseminovos-store-components-custom-3-x-productBrand', element => element.innerText);

        await page.waitForSelector('.vtex-store-components-3-x-currencyContainer');
        const price = await page.$eval('.vtex-store-components-3-x-currencyContainer', element => element.innerText);

        await page.waitForSelector('.localizaseminovos-breadcrumb-component-0-x-link--3');
        const year = await page.$eval('.localizaseminovos-breadcrumb-component-0-x-link--3', el => el.innerText);

        
        // try {
        //     await page.waitForSelector('.localizaseminovos-breadcrumb-component-0-x-link--3');
        //     let year = await page.$eval('.localizaseminovos-breadcrumb-component-0-x-link--3', el => el.innerText);
        // } catch (error) {
        //     let year = ' '
        //     console.log(error);
        // }
       

        const obj = {name, price, link, year};
        list.push(obj);
        j ++


        } catch (error) {
            console.error(error);
        }
    
    };
    
    console.log(list)

    await page.waitForTimeout(5000); //é uma funcao p vc esperar um certo tempo, ela é em milisegundos
    await browser.close();

    console.log(`Temos um total de ${list.length} informações sobre veículos`)
}) ();



