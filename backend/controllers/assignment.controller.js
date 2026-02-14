import { Op } from 'sequelize';
import Assignment from '../models/Assignment.js';
import Asset from '../models/Asset.js';
import User from '../models/User.js';
import Base from '../models/Base.js';
import EquipmentType from '../models/EquipmentType.js';

export const createAssignment = async (req, res, next) => {
  try {
    const {
      assetId,
      personnelName,
      personnelId,
      personnelRank,
      assignmentDate,
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

    // Check if asset is available
    if (asset.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Asset is not available for assignment'
      });
    }

    // Check if asset is already assigned
    const existingAssignment = await Assignment.findOne({
      where: {
        assetId,
        isActive: true
      }
    });

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: 'Asset is already assigned'
      });
    }

    // Create assignment
    const assignment = await Assignment.create({
      assetId,
      personnelName,
      personnelId,
      personnelRank,
      assignmentDate: assignmentDate || new Date(),
      notes,
      assignedBy: req.user.id
    });

    // Update asset status
    await asset.update({
      status: 'assigned'
    });

    const assignmentWithDetails = await Assignment.findByPk(assignment.id, {
      include: [
        { model: Asset, as: 'asset' },
        { model: User, as: 'assigner', attributes: ['id', 'username', 'fullName'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: { assignment: assignmentWithDetails }
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignments = async (req, res, next) => {
  try {
    const { isActive, assetId, page = 1, limit = 50 } = req.query;
    const user = req.user;

    const where = {};

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (assetId) {
      where.assetId = assetId;
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
      { model: User, as: 'assigner', attributes: ['id', 'username', 'fullName'] }
    ];

    // Filter by base for base commanders
    if (user.role === 'base_commander' && user.baseId) {
      include[0].where = { baseId: user.baseId };
    }

    const { count, rows } = await Assignment.findAndCountAll({
      where,
      include,
      order: [['assignmentDate', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        assignments: rows,
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

export const returnAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { returnDate } = req.body;

    const assignment = await Assignment.findByPk(id, {
      include: [{ model: Asset, as: 'asset' }]
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    if (!assignment.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Assignment is already returned'
      });
    }

    // Update assignment
    await assignment.update({
      isActive: false,
      returnDate: returnDate || new Date()
    });

    // Update asset status
    await assignment.asset.update({
      status: 'available'
    });

    res.json({
      success: true,
      message: 'Asset returned successfully',
      data: { assignment }
    });
  } catch (error) {
    next(error);
  }
};
