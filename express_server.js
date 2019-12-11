const express = require("express");
const app = express();
const PORT = 8080; // default port 8080



app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
function generateRandomString(outputLength) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < outputLength; i ++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  console.log('six digit code: ', result);
  return result;
}



app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase
  
  };
  

  res.render("urls_index", templateVars);
  // res.render("urls_index", urlDatabase);
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
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars)
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL])

});

app.post('/urls', (req, res) => {
  let newShortUrl = generateRandomString(6);
  res.redirect(`http://localhost:8080/urls/${newShortUrl}`);
  urlDatabase[newShortUrl] = 'http://' + req.body.longURL;
});

app.post('/urls/:shortURL/delete',(req, res) => {
   delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
});
app.post("/urls/:shortURL/update", (req, res) => {
  let longUrl = req.body.editURL
  urlDatabase[req.params.shortURL] = longUrl;
  res.redirect('/urls');
})
app.post("/urls/:shortURL/edit", (req, res) => {
  let shortUrl = req.params.shortURL
  console.log('Edit: ', req.params.shortURL);
  res.redirect(`/urls/${shortUrl}`);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
