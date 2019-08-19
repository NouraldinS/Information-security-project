const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

const database = require('./db');
const { encryptHill, decryptHill } = require('./hillCypher');

const app = express();

const PORT = 5000;

app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const { username } = req.cookies;
  if (username) res.sendFile(path.join(__dirname, 'public', 'index.html'));
  else res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username } = req.body;
  res.cookie('username', username);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/send', (req, res) => {
  const { message, username: to } = req.body;
  const { username: from } = req.cookies;
  database.write({ to, from, message: encryptHill(message.toLowerCase().replace(/\W/g, '')) });
  res.send({ success: true });
});

app.get('/read', (req, res) => {
  const { username } = req.cookies;
  const data = database.readFor(username);
  if (!data) return res.send({ empty: true });
  console.log('data', data);
  const { cypher } = data.message;
  data.message = decryptHill(data.message.cypher, data.message.box);
  return res.send({ from: data.from, message: data.message.plain, cypher });
});

app.use(express.static('public'));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
