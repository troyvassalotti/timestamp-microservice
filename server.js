// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
/* EVERYTHING ABOVE HERE INSTANTIATES THE APP IN THE BOILERPLATE*/

/* EVERYTHING BELOW HERE IS WHAT CREATES THE APP I'M MAKING */
// global function for returning the timestamps - takes a response object and the date in question.
const returnTimestamps = (res, date) => {
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
};

// global function for returning the error message for invalid dates - takes the response object.
const returnInvalidDate = (res) => {
  res.json({error: "Invalid Date"});
}

// api endpoint for the base timestamp location - returns current time.
app.get("/api/timestamp", (req, res) => {
  let now = new Date();
  returnTimestamps(res, now);
});

// setting up the full timestamp API endpoint
app.get("/api/timestamp/:date", (req, res) => { // look for :date parameter
  let dateParam = req.params.date; // store the date parameter
  let dateObj = new Date(dateParam); // turn that parameter into a date object
  let dateObjTester = dateObj.getDate(); // let's see if that object is valid
  if (isNaN(dateObjTester)) {
    let tryParsingUnix = new Date(parseInt(dateParam)); // if the date object isn't valid, then try parsing the string as if it's a unix time
    isNaN(tryParsingUnix) ? returnInvalidDate(res) : returnTimestamps(res, tryParsingUnix); // if that is still NaN, shut the whole thing down, otherwise return the timestamp.
  } else {
    returnTimestamps(res, dateObj); // if everything has been valid this whole time, return the tmestamps
  }
});