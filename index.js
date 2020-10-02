const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8ar8f.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const productCollection = client.db("ema-jhon-store").collection("products");
  const ordersCollection = client.db("ema-jhon-store").collection("orders");

  app.post("/addProduct", (req, res) => {
      const product = req.body;
      productCollection.insertMany(product)
      .then(result => {
          res.send(result.insertedCount);
      })
  })

  app.get('/products', (req, res) => {
      productCollection.find({})
      .toArray( (err, documents) => {
          res.send(documents);
      })
  })

  app.get('/product/:key', (req, res) => {
    productCollection.find({key: req.params.key})
    .toArray( (err, documents) => {
        res.send(documents[0]);
    })
  })

  app.post('/productByKeys', (req, res) => {
    const productKeys = req.body;
    productCollection.find({key: {$in: productKeys}})
    .toArray( (err, documents) => {
        res.send(documents);
    })
  })

  app.post("/addOrder", (req, res) => {
    const orders = req.body;
    ordersCollection.insertOne(orders)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
  })

});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || 4000)