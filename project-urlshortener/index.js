require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validUrl = require('valid-url'); // npm install valid-url
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlDatabase = [];
let id = 1;

app.post('/api/shorturl', (req, res) => {
  const original_url = req.body.url;

  if (!validUrl.isWebUri(original_url)) {
    return res.json({ error: 'invalid url' });
  }

  const short_url = id++;
  urlDatabase.push({ original_url, short_url });

  res.json({ original_url, short_url });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrlParam = parseInt(req.params.short_url);

  const found = urlDatabase.find(item => item.short_url === shortUrlParam);
  if (found) {
    return res.redirect(found.original_url);
  } else {
    return res.json({ error: 'No URL found for this short_url' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
