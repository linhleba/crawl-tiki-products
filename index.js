import json from 'body-parser';
import express from 'express';
const app = express();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let rawdata = fs.readFileSync(path.resolve(__dirname, 'data/product.json'));
let product = JSON.parse(rawdata);

import callAPI from './utils/apiCaller.js';
import * as BookService from './services/book.service.js';

let port = process.env.BE_PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
  res.send(product);
});

app.post('/fillBook', async function (req, res) {
  // GET ALL AUTHOR AND SAVE
  // setInterval(async () => {
  //   console.log('ok');
  // }, 5000);
  let authorDic = await BookService.getAuthor();
  // console.log(authorDic);

  // GET ALL CATEGORIES AND SAVE
  let categoryDic = await BookService.getCategory();

  // handle each item in product and call post api to server
  Promise.all(
    product.forEach(async (item, index) => {
      if (index > 632) {
        console.log('index la', index);
        await setInterval(async () => {
          // check the existence of author, category => handle and return categoryId
          const authorId = await BookService.checkAuthorExistence(
            authorDic,
            item.authors,
          );

          const categoryId = await BookService.checkCategoryExistence(
            categoryDic,
            item.categories,
          );
          console.log(categoryId);

          const payload = {
            name: item.name,
            description: item.description,
            quantity: '12',
            price: item.prices,
            author_id: [authorId],
            category_id: [categoryId],
            image_url: item.images,
          };

          // post api to create book
          await setInterval(async () => {
            console.log('posting book: ', payload.name);
            await callAPI('api/book', 'post', payload).then((res) =>
              console.log(res.status),
            );
          }, 1000);
        }, 1000);
      }
    }),
  );
  return {
    message: 'done for filling data',
  };
});

app.post('/fillBook2', async (req, res) => {
  // let data = null;
  // Promise.all(product.map((item, index) => {}));
  // setInterval(() => {
  //   console.log('ok', data);
  // }, 2000);
  let i = 730;
  let authorDic = await BookService.getAuthor();
  let categoryDic = await BookService.getCategory();

  const b = setInterval(async () => {
    if (i < product.length) {
      const authorId = await BookService.checkAuthorExistence(
        authorDic,
        product[i].authors,
      );

      const categoryId = await BookService.checkCategoryExistence(
        categoryDic,
        product[i].categories,
      );

      const numRandom = Math.floor(Math.random() * 20) + 1;
      const payload = {
        name: product[i].name,
        description: product[i].description,
        quantity: numRandom,
        price: product[i].prices,
        author_id: [authorId],
        category_id: [categoryId],
        image_url: product[i].images,
      };

      // console.log('payload', payload);

      console.log('posting book: ', payload.name);
      await callAPI('api/book', 'post', payload).then((res) => {
        console.log(res);
        // console.log(res);
        // console.log(res.data.message);
      });
      i++;
      console.log('index: ', i);
    } else {
      clearInterval();
    }
  }, 500);
});

// app.use('/', routes);

app.listen(port, () => {
  console.log(`app is listening on ${port}`);
});
