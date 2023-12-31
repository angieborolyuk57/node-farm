const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

/////////////
// Files

//const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
//console.log(textIn);

//const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
//fs.writeFileSync('./txt/output.txt', textOut);
//console.log("File written!");

// Non-blocking, async way

/* console.log("Will read file");

fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if (err) {
        console.error(`Error reading start.txt: ${err}`);
        return;
    }

    const fileName = `./txt/${data1.trim()}.txt`;

    fs.readFile(fileName, 'utf-8', (err, data2) => {
        if (err) {
            console.error(`Error reading ${fileName}: ${err}`);
            return;
        }

        console.log(data2);

        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            if (err) {
                console.error(`Error reading append.txt: ${err}`);
                return;
            }

            console.log(data3);

            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
                if (err) {
                    console.error(`Error writing final.txt: ${err}`);
                    return;
                }

                console.log("Your file has been written!😀");
            });
        });
    });
});
 */
///////////////////////
// Server
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

console.log(slugify('Fresh Avocados', { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    //Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    //API page
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //Not found page
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'Hello world!',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

//TODO: leave comments for each section in the code
//TODO:
BUG: FIXME: server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});


//routing
