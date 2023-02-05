const pup = require('puppeteer');  // para trazer a biblioteca

const url = "https://www.mercadolivre.com.br/";
const searchFor = 'macbook';

let c = 1; //deixa let pq vamos ficar somando 1 nesse cara (const n daria p fazer isso)
list = [];

(async () => {  //como teremos a dinamica de enviar coisas e esperar é um processo assincrono

    const browser = await pup.launch({headless: false});  //iniciar o navegador, o headless true (padrao) diz q o processo deve ser por de baixo dos planos

    const page = await browser.newPage();  //criar nova pagina no navegador

    console.log('Iniciou');

    await page.goto(url);  //ir para url que queremos

    console.log('Fui para url');

    await page.waitForSelector('#cb1-edit'); // isso aq é pq qnd vamos pra url ele tenta rodar o comando abaixo, mas ainda n carregou, nesse caso ele vai esperar até aparecer o seletor que estamos querendo clicar
    
    await page.type('#cb1-edit', searchFor);  // o # é pra procurar o id e ele vai nesse id e escrever o que queremos

    await Promise.all([    // nós temos que fazer isso pq o puppeteer tem um problema que é quando vc clica em um novo elemento e gera uma nova navegacao ele pede para que vc crie uma esturtura desa forma
        page.waitForNavigation(), 
        page.click('.nav-search-btn')
    ])

    const links = await page.$$eval('.ui-search-result__image > a',el => el.map(link => link.getAttribute("href"))); 

    /*
        analogo a const links = await page.$$eval('.ui-search-result__image > a',el => el.map(link => link.href));
        $$eval é tipo o document.queryselectorall, o > a é p pegar o filho 'a' dessa classe 
        $eval retorna apenas o primeiro
        ela recebe como primeiro argumento o soletor e depois a funcao que vai ser aplicada no seletor
        como el é um vetor, usa-se map para aplicar uma função passada entre parênteses a cada posição desse vetor.
        => é so uma forma de escrever uma funcao de form a condensada  
        
    */

    console.log(links);

    for (const link of links) {
        if (c===7) continue; //se o c for 7 saia do for (so p ajudar a executar o programa)
        console.log('Página: ', c);
        await page.goto(link);
        
        await page.waitForSelector('.ui-pdp-title'); //nao queremos que carregue a pagina toda cheia de coisas nada a ver, nesse caso ele so vai esperar aparecer o seletor que queremos

        const title = await page.$eval('.ui-pdp-title', element => element.innerText);
        const price = await page.$eval('.andes-money-amount__fraction', element => element.innerText);
        //const vendedor = await page.$eval('.ui-pdp-color--BLUE', element => element.innerText); tem q tomar cuidado pq essa funcao $aval necessita q o seletor q vc quer exista, mas alguns vendedores n tem o nome

        const vendedor = await page.evaluate(() => { //usa-se esse evaluate pq aq a gente pode colocar uma funcao mais js para rodar (nesse caso checar se o vendedor existe)
            const el = document.querySelector('.ui-pdp-seller__link-trigger');
            if (!el) return 'semnome' //caso nao exista esse elemento
            return el.innerText; // se existir retorna o texto desse elemento
        });

        const obj = {title, price, link, vendedor}; //salvando obj com essas informacoes

        list.push(obj);
        

        c++;
    }

    console.log(list);

    await page.waitForTimeout(3000); //é uma funcao p vc esperar um certo tempo, ela é em milisegundos
    await browser.close();

}) (); //esse () no final é já para chamar a funcao logo depois
