import { Op } from 'sequelize';
import Purchase from '../models/Purchase.js';
import Asset from '../models/Asset.js';
import EquipmentType from '../models/EquipmentType.js';
import Base from '../models/Base.js';
import User from '../models/User.js';

export const createPurchase = async (req, res, next) => {
  try {
    const {
      purchaseDate,
      equipmentTypeId,
      baseId,
      quantity,
      unitCost,
      vendor,
      purchaseOrderNumber,
      notes
    } = req.body;

    const equipmentType = await EquipmentType.findByPk(equipmentTypeId);
    if (!equipmentType) {
      return res.status(400).json({ success: false, message: 'Invalid equipment type' });
    }

    const base = await Base.findByPk(baseId);
    if (!base) {
      return res.status(400).json({ success: false, message: 'Invalid base' });
    }

    const totalCost = quantity * unitCost;

    const purchase = await Purchase.create({
      purchaseDate: purchaseDate || new Date(),
      equipmentTypeId,
      baseId,
      quantity,
      unitCost,
      totalCost,
      vendor,
      purchaseOrderNumber,
      notes,
      createdBy: req.user.id
    });

    for (let i = 0; i < quantity; i++) {
      await Asset.create({
        serialNumber: `${equipmentType.code}-${Date.now()}-${i + 1}`,
        equipmentTypeId,
        baseId,
        status: 'available',
        purchaseId: purchase.id,
        purchaseDate: purchase.purchaseDate,
        cost: unitCost
      });
    }

    res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      data: { purchase }
    });

  } catch (error) {
    next(error);
  }
};

export const getPurchases = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Purchase.findAndCountAll({
      include: [
        { model: EquipmentType, as: 'equipmentType' },
        { model: Base, as: 'base' },
        { model: User, as: 'creator', attributes: ['id', 'username', 'fullName'] }
      ],
      order: [['purchaseDate', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        purchases: rows,
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

export const getPurchaseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const purchase = await Purchase.findByPk(id, {
      include: [
        { model: EquipmentType, as: 'equipmentType' },
        { model: Base, as: 'base' },
        { model: User, as: 'creator', attributes: ['id', 'username', 'fullName'] },
        { model: Asset, as: 'assets' }
      ]
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    res.json({
      success: true,
      data: { purchase }
    });

  } catch (error) {
    next(error);
  }
};
