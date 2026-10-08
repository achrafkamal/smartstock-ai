import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export async function getUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']],
    });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, error: 'Name, email, and password are required' });
      return;
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      res.status(400).json({ success: false, error: 'Email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'MANAGER',
    });

    const userObj = user.toJSON() as Partial<User>;
    delete userObj.password;

    res.status(201).json({ success: true, data: userObj });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'smartstock_jwt_dev_secret_key_graduation_project_2026',
      { expiresIn: '7d' }
    );

    const userObj = user.toJSON() as Partial<User>;
    delete userObj.password;

    res.json({ success: true, data: { user: userObj, token } });
  } catch (error) {
    next(error);
  }
}

