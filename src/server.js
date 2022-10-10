// use the express library
const express = require('express');

// use cookie parser
const cookieParser = require('cookie-parser');

// create a new server application
const app = express();

app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');


// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

// create vars
let nextVisitorId = 1;

// The main page of our website
app.get('/', (req, res) => {
  let visitorId = req.cookies.visitorId ? nextVisitorId : ++nextVisitorId;
  
  res.cookie('visitorId', visitorId);
  res.cookie('visited', dateNow = Date.now().toString());
  
  if (req.cookies.visited) {
    req.cookies.visited = Math.floor((dateNow - req.cookies.visited ) / 1000)
  } else {
    req.cookies.visited = null;
  }
  
  console.log(req.cookies.visited);
  
  res.render('welcome', {
    name: req.query.name || "World",
    date: new Date().toGMTString(),
    visitorId: visitorId,
    visitTime: req.cookies.visited, 
  });
});


// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");
