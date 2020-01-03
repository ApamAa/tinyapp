//search urlDatabase using user email
const  getUserByEmail = function(email,database) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user].id;
    }
  }
  return null;
};

// generate random mixed code
const generateRandomString = function(outputLength) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < outputLength; i ++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// search urlData base for userId
const urlsForUser =  function(id,database) {
  let filteredURLS = {};
  for (let url in database) {
    if (database[url].userID === id) {
      filteredURLS[url] = database[url];
    }
  }
  return filteredURLS;
};

const fixURL = function(url) {
  if (url.indexOf("http://") === 0) {
    return url;
  } else {
    return "http://" + url;
  }
};

module.exports = {getUserByEmail,urlsForUser,generateRandomString,fixURL};