import { Op } from 'sequelize';
import Asset from '../models/Asset.js';
import EquipmentType from '../models/EquipmentType.js';
import Base from '../models/Base.js';

export const getAssets = async (req, res, next) => {
  try {
    const { status, baseId, equipmentTypeId, page = 1, limit = 50 } = req.query;
    const user = req.user;

    const where = {};

    if (status) {
      const statuses = status.split(',');
      if (statuses.length > 1) {
        where.status = { [Op.in]: statuses };
      } else {
        where.status = status;
      }
    }

    if (equipmentTypeId) {
      where.equipmentTypeId = equipmentTypeId;
    }

    // Apply base filter based on role
    if (user.role === 'base_commander' && user.baseId) {
      where.baseId = user.baseId;
    } else if (baseId) {
      where.baseId = baseId;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Asset.findAndCountAll({
      where,
      include: [
        { model: EquipmentType, as: 'equipmentType' },
        { model: Base, as: 'base' }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        assets: rows,
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

export const getAssetById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const asset = await Asset.findByPk(id, {
      include: [
        { model: EquipmentType, as: 'equipmentType' },
        { model: Base, as: 'base' }
      ]
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    res.json({
      success: true,
      data: { asset }
    });
  } catch (error) {
    next(error);
  }
};
