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

app.get('/build', (req, res) => {
  mountsCollection.drop();
  let userToken = apiMaster.getToken();
  userToken
    .catch(err => {
      console.error('Error: cannot retrieve Access Token', err);
    })
    .then(result => {
      let mounts = apiMaster.getMounts(result);
      mounts
        .catch(err => {
          console.error('Error: cannot retrieve mounts from Blizzard API', err);
        })
        .then(response => {
          let operations = [];
          response.map(obj => {
            let mount = { insertOne: {
              'id': obj['id'],
              'name': obj['name'],
              'link': obj['key']['href']
            }};
            operations.push(mount);
          })
          mountsCollection.bulkWrite(operations, { ordered: false });
        })
    })
    .then(result => {
      res.status(200).send('Mounts imported into MongoDB successfully.');
    })
})

app.get('/api/mounts', (req, res) => {
  let mounts = mountsCollection.find().toArray((err, data) => {
    if (err) {
      console.error('Error: cannot retrieve mounts from MongoDB', err);
    } else {
      res.status(200).send(data);
    }
  })
})

app.get('/api/single', async (req, res) => {
  let additionalInfo, infoToAdd, mountId, mountInfo;
  let mountName = req.query.name;
  mountInfo = await mountsCollection.findOne( {'name': mountName} );
  mountId = mountInfo.id;
  originalInfo = Object.assign({}, mountInfo);
  if (mountInfo.description === undefined) {
    additionalInfo = apiMaster.getMountInfo(mountInfo.id)
    additionalInfo
    .catch(err => {
      console.error('Error: cannot retrieve mounts from Blizzard API', err);
    })
    .then(response => {
        infoToAdd = {
          'description': response.description,
          'faction': response.faction,
          'requirements': response.requirements,
          'source': response.source,
          'imageUrl': response.imageUrl
        }
        mountsCollection.findOneAndUpdate({ id: response.id }, { $set: { 'description': response.description, 'faction': response.faction, 'requirements': response.requirements, 'source': response.source, 'imageUrl': response.imageUrl}})
      })
      .catch(err => {
        console.error('Error: cannot save mount\'s additional info to MongoDB', err);
      })
      .then(response => {
        let allInfo = Object.assign(originalInfo, infoToAdd);
        res.status(200).send(allInfo);
      })
      .catch(err => {
        console.error('Error: cannot send data back to the client', err);
      })
  } else {
    mountInfo =  mountsCollection.findOne( {'name': mountName}, (err, data) => {
      if (err) {
        console.log('Error: cannot send data back to the client', err);
      } else {
        res.status(200).send(data);
      }
    });
  }
})

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    return console.log('Error: unable to connect to MongoDB', err);
  }
  console.log(`Connected MongoDB: ${url}`);
  console.log(`Database: ${dbName}`);
  db = client.db(dbName);
  mountsCollection = db.collection('mounts');
  app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
});


// https://us.api.blizzard.com/data/wow/media/creature-display/2404?namespace=static-9.0.5_37760-us&access_token=UShGPFs9J6GBbXmG5RIdpY8QN1afMiu4Ff