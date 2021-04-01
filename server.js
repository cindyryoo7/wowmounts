const express = require('express');
const bodyParser = require('body-parser');
const apiMaster = require('./apiMaster.js')
const cors = require('cors');
const url = 'mongodb://127.0.0.1:27017';
const MongoClient = require('mongodb').MongoClient;
let db, mountsCollection, myMountsCollection;
const dbName = 'mvp';
const port = 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/token', (req, res) => {
  let userToken = apiMaster.getToken();
  userToken
    .catch(err => {
      console.error('Error: cannot retrieve Access Token', err);
    })
    .then(result => {
      res.send(result);
    })
})

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

app.get('/api/login', (req, res) => {
  console.log('this is being called')
  res.send(`https://us.battle.net/oauth/authorize?client_id=076df79030cd4aa3948bc0bb5d77ee33&scope=wow.profile&redirect_uri=http://10.0.0.194/api/mymounts&response_type=code&response_type=code`);

  // let token = apiMaster.authenticateUser();
  // token
  // .catch(err => {
  //   console.error('Error: cannot login user to Blizzard', err);
  // })
  // .then(response => {
  //   // console.log('response from server', response);
  //   res.redirect(response);
  // })
})

app.get('/api/mymounts', (req, res) => {
  // https://us.battle.net/login/en/authenticator?hasSms=true&mobile=true&ref=https://us.battle.net/oauth/authorize?client_id%3D076df79030cd4aa3948bc0bb5d77ee33%26scope%3Dwow.profile%26redirect_uri%3Dhttp://10.0.0.194/api/mymounts%26response_type%3Dcode&app=oauth&cr=true
  let token = req.query.code;
  console.log(token);
  let userToken = apiMaster.getUserToken();
  userToken
    .catch(err => {
      console.error('Error: cannot get user token from Blizzard API', err);
    })
    .then(response => {
      let mounts = apiMaster.getUserMounts(response.access_token)
      mounts
        .catch(err => {
          console.error('Error: cannot retrieve user mounts from Blizzard API', err);
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
          myMountsCollection.bulkWrite(operations, { ordered: false });
        })
      })
      .then(result => {
        let mounts = myMountsCollection.find().toArray((err, data) => {
          if (err) {
            console.error('Error: cannot retrieve mounts from MongoDB', err);
          } else {
            res.status(200).send(data);
          }
        })
      })
})

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    return console.log('Error: unable to connect to MongoDB', err);
  }
  console.log(`Connected MongoDB: ${url}`);
  console.log(`Database: ${dbName}`);
  db = client.db(dbName);
  mountsCollection = db.collection('mounts');
  myMountsCollection = db.collection('mymounts');
  app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
});