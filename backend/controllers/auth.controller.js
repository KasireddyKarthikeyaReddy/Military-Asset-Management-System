import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import User from '../models/User.js';
import Base from '../models/Base.js';

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

/* =====================================================
   REGISTER USER
===================================================== */
export const register = async (req, res, next) => {
  try {
    const { username, email, password, role, baseId, fullName } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    if (baseId) {
      const base = await Base.findByPk(baseId);
      if (!base) {
        return res.status(400).json({
          success: false,
          message: 'Invalid base ID'
        });
      }
    }

    // ❌ DO NOT HASH HERE
    // Model hook will hash automatically

    const user = await User.create({
      username,
      email,
      password,   // ✅ send plain password
      role: role || 'logistics_officer',
      baseId,
      fullName,
      isActive: true
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          baseId: user.baseId,
          fullName: user.fullName
        }
      }
    });

  } catch (error) {
    next(error);
  }
};


/* =====================================================
   LOGIN USER
===================================================== */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({
      where: { email },
      include: [{
        model: Base,
        as: 'base',
        attributes: ['id', 'name', 'code']
      }]
    });

    if (!user || user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 🔐 Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          baseId: user.baseId,
          fullName: user.fullName,
          base: user.base
        }
      }
    });

  } catch (error) {
    next(error);
  }
};


/* =====================================================
   GET PROFILE
===================================================== */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Base,
        as: 'base',
        attributes: ['id', 'name', 'code', 'location']
      }]
    });

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    next(error);
  }
};
