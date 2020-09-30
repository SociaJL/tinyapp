const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.set("view engine", "ejs");

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8)
}

// const userDatabase = {
//   name: {
//     nicename: "lowercasename",
//     fullname: "fullname",
//     email: "emailaddress@email.com",
//     password:"password"
//   },
//   name2: {
//     nicename: "lowercasename",
//     fullname: "fullname",
//     email: "emailaddress@email.com",
//     password:"password"
//   }
// }

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// cont urlDatabase = {
//   b2xVn2: {
//     longURL: "http://www.lighthouselabs.ca",
//     shortURL: 
//   }
// }

app.get("/", (req, res) => {
  res.send("Hello There!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    username: req.cookies["username"]
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {    // everywhere there is a render, update to add the cookies. ALSO _header conditionals/
  const templateVars = { 
    username: req.cookies["username"],
  }
  res.render("urls_new", templateVars);
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"],
  }
  res.render("urls_show", templateVars)
})

app.get("/hello", (req, res) => {
  const templateVars = { 
    greeting: 'Home Page',
    username: req.cookies["username"], 
  };
  res.render("hello_world", templateVars);
});

app.post("/urls", (req, res) => {
  //console.log(req.body)
  let newurl = req.body.longURL
  let newRandomShortUrl = generateRandomString(newurl)
  urlDatabase[newRandomShortUrl] = newurl
  //console.log(urlDatabase)
  
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);

});

app.post("/login", (req, res) => {
  
  const newUser = req.body.username
  res.cookie('username', newUser)
  res.redirect("/urls")
})

app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect("/urls")
})

app.post("/register", (req, res) => {

 
})

app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies.username
  }
  res.render("register", templateVars)
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
  console.log("req.params:", req.params)
  // console.log("req.body", req.body)
})


app.post("/urls/:shortURL/update", (req, res) => {
  let newurl = req.body.longURL
  urlDatabase[req.params.shortURL] = newurl
  res.redirect("/urls")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

