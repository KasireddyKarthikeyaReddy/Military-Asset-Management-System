import { Op } from 'sequelize';
import Asset from '../models/Asset.js';
import EquipmentType from '../models/EquipmentType.js';
import Base from '../models/Base.js';

/* =====================================================
   CREATE ASSET (Admin Only)
===================================================== */
export const createAsset = async (req, res, next) => {
  try {
    const {
      equipmentTypeId,
      baseId,
      status = 'available'
    } = req.body;

    // Validate Equipment Type
    const equipmentType = await EquipmentType.findByPk(equipmentTypeId);
    if (!equipmentType) {
      return res.status(400).json({
        success: false,
        message: 'Invalid equipment type'
      });
    }

    // Validate Base
    const base = await Base.findByPk(baseId);
    if (!base) {
      return res.status(400).json({
        success: false,
        message: 'Invalid base'
      });
    }

    const asset = await Asset.create({
      equipmentTypeId,
      baseId,
      status
    });

    res.status(201).json({
      success: true,
      data: asset
    });

  } catch (error) {
    next(error);
  }
};


/* =====================================================
   GET ALL ASSETS
===================================================== */
export const getAssets = async (req, res, next) => {
  try {
    const { status, baseId, equipmentTypeId, page = 1, limit = 50 } = req.query;
    const user = req.user;

    const where = {};

    if (status) {
      const statuses = status.split(',');
      where.status =
        statuses.length > 1 ? { [Op.in]: statuses } : status;
    }

    if (equipmentTypeId) {
      where.equipmentTypeId = equipmentTypeId;
    }

    // Role-based base filtering
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


/* =====================================================
   GET ASSET BY ID
===================================================== */
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
