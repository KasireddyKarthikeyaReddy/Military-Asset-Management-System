import { Op } from 'sequelize';
import User from '../models/User.js';
import Base from '../models/Base.js';
import EquipmentType from '../models/EquipmentType.js';

export const getUsers = async (req, res, next) => {
  try {
    const { role, baseId, page = 1, limit = 50 } = req.query;
    const user = req.user;

    const where = {};

    if (role) {
      where.role = role;
    }

    // Base commanders can only see users from their base
    if (user.role === 'base_commander' && user.baseId) {
      where.baseId = user.baseId;
    } else if (baseId) {
      where.baseId = baseId;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      include: [{
        model: Base,
        as: 'base',
        attributes: ['id', 'name', 'code']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        users: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getBases = async (req, res, next) => {
  try {
    const bases = await Base.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { bases }
    });
  } catch (error) {
    next(error);
  }
};

export const getEquipmentTypes = async (req, res, next) => {
  try {
    const equipmentTypes = await EquipmentType.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { equipmentTypes }
    });
  } catch (error) {
    next(error);
  }
};
