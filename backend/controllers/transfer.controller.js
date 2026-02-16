import { Op } from 'sequelize';
import Transfer from '../models/Transfer.js';
import Asset from '../models/Asset.js';
import Base from '../models/Base.js';
import User from '../models/User.js';

export const createTransfer = async (req, res, next) => {
  try {
    const { assetId, fromBaseId, toBaseId, transferType, reason } = req.body;

    // ✅ Basic validation
    if (!assetId || !fromBaseId || !toBaseId || !transferType) {
      return res.status(400).json({
        success: false,
        message: 'assetId, fromBaseId, toBaseId and transferType are required'
      });
    }

    const asset = await Asset.findByPk(assetId);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    if (asset.baseId !== fromBaseId) {
      return res.status(400).json({
        success: false,
        message: 'Asset not at source base'
      });
    }

    const transfer = await Transfer.create({
      transferDate: new Date(),
      assetId,
      fromBaseId,
      toBaseId,
      transferType, // ✅ FIX ADDED HERE
      reason,
      createdBy: req.user.id
    });

    // ✅ Update asset base
    await asset.update({
      baseId: toBaseId,
      status: 'available'
    });

    res.status(201).json({
      success: true,
      message: 'Transfer successful',
      data: { transfer }
    });

  } catch (error) {
    next(error);
  }
};

export const getTransfers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Transfer.findAndCountAll({
      include: [
        { model: Asset, as: 'asset' },
        { model: Base, as: 'fromBase' },
        { model: Base, as: 'toBase' },
        { model: User, as: 'creator', attributes: ['id', 'username', 'fullName'] }
      ],
      order: [['transferDate', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        transfers: rows,
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

export const getTransferById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transfer = await Transfer.findByPk(id, {
      include: [
        { model: Asset, as: 'asset' },
        { model: Base, as: 'fromBase' },
        { model: Base, as: 'toBase' }
      ]
    });

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }

    res.json({
      success: true,
      data: { transfer }
    });

  } catch (error) {
    next(error);
  }
};
