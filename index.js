const { json } = require('body-parser');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

let rawdata = fs.readFileSync(path.resolve(__dirname, 'data/product.json'));
let product = JSON.parse(rawdata);

// const jsonData = require('./data/product.txt');

let port = process.env.BE_PORT || 3001;

// package for getting value in cookie
// app.use(cookieParser());
// body-parser

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
  // datalist = []
  // jsonData.map(obj, index => {
  //     datalist
  // })
  res.send(product);
});

// app.use('/', routes);

app.listen(port, () => {
  console.log(`app is listening on ${port}`);
});
