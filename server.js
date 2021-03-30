const express = require('express');
const bodyParser = require('body-parser');
const apiMaster = require('./apiMaster.js')
const cors = require('cors');
const url = 'mongodb://127.0.0.1:27017';
const MongoClient = require('mongodb').MongoClient;
let db, mountsCollection;
const dbName = 'mvp';
const port = 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api', (req, res) => {
  mountsCollection.drop();
  let userToken = apiMaster.getToken();
  userToken
    .catch(err => {
      console.error('Error: cannot retrieve Access Token')
    })
    .then(result => {
      let mounts = apiMaster.getMounts(result);
      mounts
        .catch(err => {
          console.error('Error: cannot retrieve mounts from Blizzard API')
        })
        .then(response => {
          let operations = [];
          response.map(obj => {
            let mount = { insertOne: {
              'id': obj['id'],
              'name': obj['name'],
              'link': obj['key']['href']
            }}
            operations.push(mount);
          })
          mountsCollection.bulkWrite(operations, { ordered: false });
        })
    })
    .then(result => {
      res.status(200).send('Mounts imported into MongoDB successfully.')
    })
})

app.get('/api/mounts', (req, res) => {
  let mounts = mountsCollection.find().toArray((err, data) => {
    if (err) {
      console.log('error')
    } else {
      res.status(200).send(data)
    }
  })
})

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    return console.log('Error: unable to connect to MongoDB');
  }
  console.log(`Connected MongoDB: ${url}`);
  console.log(`Database: ${dbName}`);
  db = client.db(dbName);
  mountsCollection = db.collection('mounts');
  app.listen(port, () => {
    console.log(`Server listening on ${port}`);

  });
});
