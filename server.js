const express = require('express');
const bodyParser = require('body-parser');
const port = 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/mounts', (req, res) => {
  res.status(200).send('hello world');
})

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
