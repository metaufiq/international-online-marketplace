const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const db = require('./server/db/database');
const cors = require('cors')
const deduplicateCarts = require('./server/service/cartSvc')

app.use(express.static(path.join(__dirname, 'build')));

app.use(cors());

app.get('/health', function (req, res) {
  return res.send('ok');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// Get product info API
app.get('/product', function (req, res) {
  db.all(`SELECT id FROM product WHERE product.is_obsoleted IS NULL`, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json({ "data": rows });
  });
})


//Set Obsoleted Product
app.put('/product/set-obsoleted', function (req,res) {
  db.run(`UPDATE product
  SET is_obsoleted = 1
  WHERE product.type = 'B' AND product.price > 20;`, (err) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
  })
  db.all("SELECT * FROM product", (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json({ "data": rows });
  });
})


//Get membership info 
app.get('/membership', function (req, res) {
  const sql = `SELECT * FROM membership ${req.query.grade ? `WHERE grade='${req.query.grade}'` : ''}`;
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json({ "data": rows });
  })

})


// Add product to cart API with query params productId
app.post('/cart', function (req, res) {

  if (typeof req.query.productId === "undefined") {
    res.status(400).json({ "error": "Missing query param - productId" });
    return;
  }

  db.run(`INSERT INTO cart_item (product_id) VALUES (${req.query.productId})`, (err) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    db.all(`SELECT p.id,p.name,p.price FROM cart_item ct INNER JOIN product p on ct.product_id = p.id`, (err, rows) => {
      res.status(201).json({ "data": rows });
    })

  })
})


// Get cart's product
app.get('/cart', function (req, res) {
  db.all(`SELECT p.id,p.name,p.price FROM cart_item ct INNER JOIN product p on ct.product_id = p.id`, (err, rows) => {

    const result = deduplicateCarts(rows);

    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json({ "data": result });
  })
})

//Delet cart's prodcut 
app.delete('/cart', function (req, res) {
  db.run(`DELETE FROM cart_item`, (err) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
  })

  db.all(`SELECT p.id,p.name,p.price FROM cart_item ct INNER JOIN product p on ct.product_id = p.id`, (err, rows) => {
    res.status(201).json({ "data": rows });
  })

})


app.listen(port, () => {
  console.log(`Start listening on port ${port}...`)
});

module.exports = { app };



