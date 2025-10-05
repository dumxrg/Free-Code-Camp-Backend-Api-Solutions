const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const users = [];
let userId = 1;

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  if (!username) return res.json({ error: 'Username is required' });

  const user = { username, _id: userId.toString(), log: [] };
  userId++;
  users.push(user);

  res.json({ username: user.username, _id: user._id });
});

app.get('/api/users', (req, res) => {
  const simplifiedUsers = users.map(u => ({ username: u.username, _id: u._id }));
  res.json(simplifiedUsers);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const user = users.find(u => u._id === req.params._id);
  if (!user) return res.json({ error: 'User not found' });

  const { description, duration, date } = req.body;
  if (!description || !duration) return res.json({ error: 'Description and duration are required' });

  const exercise = {
    description: description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString()
  };

  user.log.push(exercise);

  res.json({
    _id: user._id,
    username: user.username,
    date: exercise.date,
    duration: exercise.duration,
    description: exercise.description
  });
})

app.get('/api/users/:_id/logs', (req, res) => {
  const user = users.find(u => u._id === req.params._id);
  if (!user) return res.json({ error: 'User not found' });

  let log = [...user.log];

  const { from, to, limit } = req.query;

  if (from) log = log.filter(e => new Date(e.date) >= new Date(from));
  if (to) log = log.filter(e => new Date(e.date) <= new Date(to));
  if (limit) log = log.slice(0, parseInt(limit));

  const formattedLog = log.map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date
  }));

  res.json({
    _id: user._id,
    username: user.username,
    count: formattedLog.length,
    log: formattedLog
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
