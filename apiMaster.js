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
    // TODO: somehow write the token to my config file? it is currently manually written
    return response.defaults.token;
  } catch (err) {
    console.log('Error: cannot retrieve Access Token from Blizzard API', err);
  }
};

const authenticateUser = async () => {
  try {
    let authenticate = await axios.get(`https://us.battle.net/oauth/authorize?client_id=${config.client_id}&scope=wow.profile&redirect_uri=http://10.0.0.194/api/mymounts&response_type=code&response_type=code`);

    console.log('authenticate', authenticate);
    return authenticate.data;
  } catch (err) {
    console.log('Error: cannot authenticate user', err);
  }
}

const getUserToken = () => {
  try {
    return axios.post(`https://us.battle.net/oauth/token`,
    {
      scope: 'wow.profile',
      redirect_uri: 'http://10.0.0.194/api/mymounts',
      grant_type: 'authorization_code',
      code: config.authenticationCode
    },
    {
      auth: {
        username: config.client_id,
        password: config.client_secret
      }
    })
  } catch (err) {
    console.log('Error: cannot get user token from Blizzard API', err);
  }
}

const getMounts = async () => {
  try {
    let response = await axios.get(`https://us.api.blizzard.com/data/wow/mount/index?namespace=static-us&locale=en_US&access_token=${config.token}`)
    return response.data.mounts;
  } catch (err) {
    console.log('Error: cannot retrieve mounts from Blizzard API', err);
  }
}

const getUserMounts = async (token) => {
  try {
    let response = await axios.get(`https://us.api.blizzard.com/profile/user/wow/collections/mounts?namespace=profile-us&locale=en_US&access_token=${token}`)
  } catch (err) {
    console.log('Error: cannot retrieve user mounts from Blizzard API', err);
  }
}

const getMountInfo = async (mountID) => {
  try {
    let info = await axios.get(`https://us.api.blizzard.com/data/wow/mount/${mountID}?namespace=static-us&locale=en_US&access_token=${config.token}`);
    let imageRedirect = info.data['creature_displays'][0]['key']['href'];
    let url = await axios.get(`${imageRedirect}&access_token=${config.token}`);
    let mountInfo = {
      id: mountID,
      description: info.data['description'],
      faction: info.data['faction'] ? info.data['faction']['name'] : null,
      requirements: info.data['requirements'] ? info.data['requirements'] : null,
      source: info.data['source']['name'],
      imageUrl: url.data['assets'][0]['value']
    };
    return mountInfo;
  } catch (err) {
    console.log('Error: cannot retrieve mount\'s info from Blizzard Api', err);
  }
}

module.exports = {
  getToken,
  getMounts,
  getMountInfo,
  authenticateUser,
  getUserToken
}