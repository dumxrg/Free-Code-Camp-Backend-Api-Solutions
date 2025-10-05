
var express = require('express');
var app = express();
var cors = require('cors');

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});


app.get("/api/:date?", function (req, res) {
  let dateString = req.params.date;

  if (!dateString) {
    let now = new Date();
    return res.json({ unix: now.valueOf(), utc: now.toUTCString() });
  }
  if (/^\d+$/.test(dateString)) {
    let dateInt = parseInt(dateString);
    let date = new Date(dateInt);
    return res.json({ unix: dateInt, utc: date.toUTCString() });
  }

  
  let date = new Date(dateString);
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }
  res.json({ unix: date.valueOf(), utc: date.toUTCString() });
});

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
