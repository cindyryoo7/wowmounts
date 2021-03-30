const axios = require('axios');
const blizzard = require('blizzard.js');
const config = require('./config.js');

const getToken = async () => {
  try {
    let response = await blizzard.wow.createInstance({
      key: config.client_id,
      secret: config.client_secret,
      origin: 'us',
      locale: 'en_US',
      token: ''
    })
    return response.defaults.token;
  } catch (error) {
    console.log('error')
  }
};

const getMounts = async (token) => {
  try {
    let response = await axios.get(`https://us.api.blizzard.com/data/wow/mount/index?namespace=static-us&locale=en_US&access_token=${token}`)
    return response.data.mounts;
  } catch (error) {
    console.log('error')
  }
}

module.exports = {
  getToken,
  getMounts
}