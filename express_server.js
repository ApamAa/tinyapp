const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080
app.use(cookieParser());


app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

let urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
const urlDatabaseALL = urlDatabase;
// /*
// const urlDatabase = {
  
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };
// */
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
}
function generateRandomString(outputLength) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < outputLength; i ++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  console.log('six digit code: ', result);
  return result;
}


function findUser(email) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
  return null;
}

function urlsForUser(id) {
  let filteredURLS = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id){
      filteredURLS[url] = urlDatabase[url];
    }
  }
  return filteredURLS
}

app.get("/urls", (req, res) => {
  
 
    if (typeof req.cookies["user_id"] !== 'undefined'){ 
      let templateVars = {
      urls: urlsForUser(req.cookies["user_id"]),
      userobj: users[req.cookies["user_id"]]
      };

      res.render("urls_index", templateVars);

    } else {
      
      res.redirect("/login");
    }
  
});
  


app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userobj: users[req.cookies["user_id"]]}
    if (typeof templateVars.userobj !== "undefined") {

    res.render("urls_new",templateVars);
    } else {
      res.redirect("/login");
    }
});

app.get("/urls/:shortURL", (req, res) => {
  console.log()
  if (typeof req.cookies["user_id"] !== 'undefined'){
      userURLs = urlsForUser(req.cookies["user_id"]);
      if (typeof userURLs[req.params.shortURL] !== 'undefined') {
          let templateVars = {shortURL : req.params.shortURL,
                              longURL: urlDatabase[req.params.shortURL].longURL,
                              userobj: users[req.cookies["user_id"]]}
          res.render("urls_show", templateVars)                    
      } else {
        res.send("Please log in first")
      }
    } else {
      res.send("Please Sign in first")
    }

  
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL)

});
app.get("/register", (req, res) => { //marhale avvale empliment
  let templateVars = {
    urls: urlDatabase,
    userobj: users[req.cookies["user_id"]]
 };
  res.render("urls_register",templateVars);
});
app.get("/login", (req, res) => { //marhale avvale empliment
  let templateVars = {
    userobj: users[req.cookies["user_id"]]
 };
  res.render("login",templateVars);
});

app.post('/urls', (req, res) => {
  let newShortUrl = generateRandomString(6);
  //res.redirect(`http://localhost:8080/urls/${newShortUrl}`);
  res.redirect(`http://${req.body.longURL}`);
  urlDatabase[newShortUrl] = {longURL : 'http://' + req.body.longURL,
                              userID : req.cookies["user_id"]}                           
});

app.post('/urls/:shortURL/delete',(req, res) => {
  urlDatabase = urlsForUser(req.cookies["user_id"]);
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
});
app.post("/urls/:shortURL/update", (req, res) => {
  let longUrl = req.body.editURL
  urlDatabase[req.params.shortURL] = {longUrl:longURL , userID : req.cookies["user_id"]} ;
  res.redirect('/urls');
})
app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase = urlsForUser(req.cookies["user_id"]);
  let shortUrl = req.params.shortURL
  console.log('Edit: ', req.params.shortURL);
  res.redirect(`/urls/${shortUrl}`);
})
app.post("/login", (req, res) => {
  email = req.body.email;
  password = req.body.password;
  id = findUser(email);
  if (!id) {
    res.send("status code 403 : user email is not registered ")
  } else if(users[id].password === password) {
    res.cookie("user_id", id);
    urlDatabase = urlsForUser(id);
    res.redirect('/urls') 
  } else {
    res.send("status code :403");
  }
})
app.post("/logout", (req, res) => {
  urlDatabase = urlDatabaseALL;
  res.clearCookie('user_id');
  res.redirect('/urls');
})

app.post("/register", (req, res) => { 
  const email = req.body.email
  const password = req.body.password;
 
  const id = generateRandomString(10);
  const findemail = findUser(email);
   if (email !== "" && password !== "" && !findemail) {
    let userobj = {id: id, email: email, password: password};
    users[id] = userobj;
    
    res.cookie('user_id',id);
    res.redirect('/urls');
    console.log(res.cookies);
  } else {
    res.send("Error : status code 400")

  }
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
