const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const users = [];

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Signup handler
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const exists = users.find(u => u.username === username);
  if (exists) return res.send('User already exists <a href="/signup.html">Try again</a>');

  const hash = await bcrypt.hash(password, 10);
  users.push({ username, password: hash });
  res.redirect('/');
});

// Login handler
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.send('Invalid credentials <a href="/">Try again</a>');

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/profile.html');
});

// Check auth for frontend
app.get('/check-auth', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json(user);
  } catch (err) {
    res.sendStatus(403);
  }
});

app.listen(3000, () => console.log('http://localhost:3000'));
