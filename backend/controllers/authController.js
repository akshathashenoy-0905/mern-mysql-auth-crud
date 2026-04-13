const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  await db.query(
    'INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)',
    [name, email, phone, hash]
  );

  res.json({ msg: 'User Registered' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [users] = await db.query(
    'SELECT * FROM users WHERE email=?',
    [email]
  );

  if (users.length === 0)
    return res.status(400).json({ msg: 'User not found' });

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.status(400).json({ msg: 'Wrong password' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
};
