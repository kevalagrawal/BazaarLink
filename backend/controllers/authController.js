import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res) => {
  const { name, phone, location, password, role, kyc } = req.body;
  if (!name || !phone || !location || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const userExists = await User.findOne({ phone });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    phone,
    location,
    password: hashedPassword,
    role,
    kyc,
  });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    phone: user.phone,
    location: user.location,
    role: user.role,
    token: generateToken(user),
  });
};

export const login = async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      location: user.location,
      role: user.role,
      token: generateToken(user),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}; 