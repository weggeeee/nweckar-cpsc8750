const fetch = require('node-fetch');

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

const makeAnswer = (correctAnswer, answers) => {
  const answerLinks = answers.map(answer => {
    return `<a href="javascript:alert('${answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
      }')">${answer}</a>`
  });
  return answerLinks;
}

app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const data = await response.json();

  const results = data.results[0];

  // fail if db failed
  if (data.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${data.response_code}`);
    return;
  }
  const allAnswers = [...results.incorrect_answers, results.correct_answer].sort(() => (Math.random() - .5));
  
  // respond to the browser
  // TODO: make proper html
  res.render('trivia', {
    question: results.question,
    answers: makeAnswer(results.correct_answer, allAnswers),
    category: results.category,
    difficulty: results.difficulty,
  });
});


// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");
