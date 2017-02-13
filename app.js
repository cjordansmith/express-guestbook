var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");

var app = express();// makes an express app

var entries = [];// creates a global array to store all our entries
app.locals.entries = entries;// makes this entries array available in all views

app.use(logger('dev'));// use Morgan to log every request

app.set('views', path.resolve(__dirname, 'views'));// tells express views are in the 'views' folder
app.set('view engine', 'ejs');//  tells express the views will use the EJS engine

//  populates a variable called req.body if the user is submitting the form. (the extended option is required)
app.use(bodyParser.urlencoded({ extended: false }));

// when visiting the site root, renders the homepage (at views/index.ejs)
app.get('/', function(req, res) {
  res.render('index');
});

// renders the 'new-entry' page (at views/index.ejs) when GETing the urlencoded
app.get('/new-entry', function(req, res) {
  res.render('new-entry');
});

//  Defines a route handler when you POST to the 'new-entry' URL in contrast to a GET
// if user submits the form with no title or content, responds with a 400 error
// adds a new entry to the list of entries
//  redirects to the homepage to see your new entry
app.post('/new-entry', function(req, res) {
  if (!req.body.title || !req.body.body) {
    res.status(400).send("Entries must have a title and a body.");
    return;
  }
  entries.push({
    title: req.body.title,
    body: req.body.body,
    published: new Date()
  });
  res.redirect('/');
});

// renders a 404 page because you're requesting an unknown source
app.use(function(req, res) {
  res.status(404).render('404');
});

// starts the server on port 3000
http.createServer(app).listen(3000, function() {
  console.log("Guestbook app started on port 3000.");
});
