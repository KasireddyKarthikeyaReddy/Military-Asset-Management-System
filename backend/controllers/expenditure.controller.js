import { Op } from 'sequelize';
import Expenditure from '../models/Expenditure.js';
import Asset from '../models/Asset.js';
import User from '../models/User.js';
import Assignment from '../models/Assignment.js';
import Base from '../models/Base.js';
import EquipmentType from '../models/EquipmentType.js';

export const createExpenditure = async (req, res, next) => {
  try {
    const {
      assetId,
      expenditureDate,
      reason,
      disposalMethod,
      disposalValue,
      notes
    } = req.body;

    // Validate asset exists
    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Check if asset is already expended
    if (asset.status === 'expended') {
      return res.status(400).json({
        success: false,
        message: 'Asset is already marked as expended'
      });
    }

    // Create expenditure record
    const expenditure = await Expenditure.create({
      assetId,
      expenditureDate: expenditureDate || new Date(),
      reason,
      disposalMethod,
      disposalValue,
      notes,
      markedBy: req.user.id
    });

    // Update asset status
    await asset.update({
      status: 'expended'
    });

    // If asset was assigned, mark assignment as inactive
    await Assignment.update(
      { isActive: false, returnDate: new Date() },
      { where: { assetId, isActive: true } }
    );

    const expenditureWithDetails = await Expenditure.findByPk(expenditure.id, {
      include: [
        { model: Asset, as: 'asset' },
        { model: User, as: 'marker', attributes: ['id', 'username', 'fullName'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Asset marked as expended successfully',
      data: { expenditure: expenditureWithDetails }
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenditures = async (req, res, next) => {
  try {
    const { startDate, endDate, disposalMethod, page = 1, limit = 50 } = req.query;
    const user = req.user;

    const where = {};

    // Apply date filters
    if (startDate || endDate) {
      where.expenditureDate = {};
      if (startDate) where.expenditureDate[Op.gte] = new Date(startDate);
      if (endDate) where.expenditureDate[Op.lte] = new Date(endDate);
    }

    // Apply disposal method filter
    if (disposalMethod) {
      where.disposalMethod = disposalMethod;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const include = [
      { 
        model: Asset, 
        as: 'asset',
        include: [
          { model: Base, as: 'base' },
          { model: EquipmentType, as: 'equipmentType' }
        ]
      },
      { model: User, as: 'marker', attributes: ['id', 'username', 'fullName'] }
    ];

    // Filter by base for base commanders
    if (user.role === 'base_commander' && user.baseId) {
      include[0].where = { baseId: user.baseId };
    }

    const { count, rows } = await Expenditure.findAndCountAll({
      where,
      include,
      order: [['expenditureDate', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        expenditures: rows,
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

export const getExpenditureById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const expenditure = await Expenditure.findByPk(id, {
      include: [
        { model: Asset, as: 'asset' },
        { model: User, as: 'marker', attributes: ['id', 'username', 'fullName'] }
      ]
    });

    if (!expenditure) {
      return res.status(404).json({
        success: false,
        message: 'Expenditure record not found'
      });
    }

    res.json({
      success: true,
      data: { expenditure }
    });
  } catch (error) {
    next(error);
  }
};
