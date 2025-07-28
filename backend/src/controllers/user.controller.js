const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { AppDataSource } = require('../data-source');
const User = require('../models/User');

const userRepo = AppDataSource.getRepository(User);

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepo.create({ username, password: hashedPassword });
    await userRepo.save(user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userRepo.findOneBy({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret');
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
};

exports.getProfile = async (req, res) => {
  const user = await userRepo.findOneBy({ id: req.user.userId });
  res.json({ user });
};