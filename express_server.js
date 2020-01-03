// initial set-up, package requiremnt, helper functions etc
const express = require("express");
const {getUserByEmail,urlsForUser,generateRandomString,fixURL} = require('./helpers'); // requiring all the modules from helper file
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080;
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
app.use(cookieSession({
  name: 'session',
  keys: ['P'],
  maxAge: 24 * 60 * 60 * 1000
}));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// dummy urlDatabase
let urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

// dummy user-database
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


// get request to /urls
app.get("/urls", (req, res) => {
  if (typeof users[req.session.userId] !== "undefined") {
    let templateVars = {
      urls: urlsForUser(req.session.userId,urlDatabase),
      userobj: users[req.session.userId]
    };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

// get request to home /
app.get("/", (req, res) => {
  if (typeof users[req.session.userId] !== "undefined") {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
  
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userobj: users[req.session.userId]};
  if (typeof templateVars.userobj !== "undefined") {
    res.render("urls_new",templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (typeof req.session.userId !== 'undefined') {
    let userURLs = urlsForUser(req.session.userId,urlDatabase);
    if (typeof userURLs[req.params.shortURL] !== 'undefined') {
      let templateVars = {shortURL : req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL].longURL,
        userobj: users[req.session.userId]};
      res.render("urls_show", templateVars);
    } else {
      res.send("Please log in first");
    }
  } else {
    res.send("Please Sign in first");
  }
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userobj: users[req.session.userId]
  };
  res.render("urls_register",templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    userobj: users[req.session.userId]
  };
  res.render("login",templateVars);
});

app.post('/urls', (req, res) => {
  let newShortUrl = generateRandomString(6);
  urlDatabase[newShortUrl] = {longURL : fixURL(req.body.longURL),
    userID : req.session.userId};
  res.redirect(`/urls/${newShortUrl}`);
});

app.post('/urls/:shortURL/delete',(req, res) => {
  if (typeof users[req.session.userId] !== "undefined") {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect('/login');
  }
});

app.post("/urls/:shortURL/update", (req, res) => {
  let longURL = fixURL(req.body.editURL);
  urlDatabase[req.params.shortURL] = {longURL:longURL , userID : req.session.userId};
  res.redirect('/urls');
});

app.post("/urls/:shortURL/edit", (req, res) => {
  if (typeof users[req.session.userId] !== "undefined") {
    let shortUrl = req.params.shortURL;
    res.redirect(`/urls/${shortUrl}`);
  } else {
    res.redirect('/login');
  }
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let LogInPassword = req.body.password;
  let id = getUserByEmail(email, users);
  if (!id) {
    res.send("status code 403 : user email is not registered ");
  } else if (bcrypt.compareSync(LogInPassword, users[id].password)) {
    req.session.userId = id;
    res.redirect('/urls');
  } else {
    res.send("status code :403");
  }
});

app.post("/logout", (req, res) => {
  delete req.session.userId;
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const RegisteredPassword = req.body.password;
  const password = bcrypt.hashSync(RegisteredPassword, 10); // using bcrypt to encript the password
  const id = generateRandomString(10);
  const findemail = getUserByEmail(email, users);
  if (email !== "" && password !== "" && !findemail) {
    let userobj = {id: id, email: email, password: password};
    users[id] = userobj;
    req.session.userId = id;
    res.redirect('/urls');
  } else {
    res.send("Error : status code 400");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});