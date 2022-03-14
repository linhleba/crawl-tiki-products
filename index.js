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
  let authorDic = await BookService.getAuthor();
  // console.log(authorDic);

  // GET ALL CATEGORIES AND SAVE
  let categoryDic = await BookService.getCategory();

  // handle each item in product and call post api to server
  Promise.all(
    product.map(async (item) => {
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
      setInterval(async () => {
        console.log('posting book: ', payload.name);
        await callAPI('api/book', 'post', payload).then((res) =>
          console.log(res.status),
        );
      }, 5000);
    }),
  );
  return {
    message: 'done for filling data',
  };
});

// app.use('/', routes);

app.listen(port, () => {
  console.log(`app is listening on ${port}`);
});
