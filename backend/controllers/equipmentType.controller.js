import EquipmentType from '../models/EquipmentType.js';

// Create Equipment Type (Admin only)
export const createEquipmentType = async (req, res, next) => {
  try {
    const { name, category, unit, description } = req.body;

    if (!name || !category || !unit) {
      return res.status(400).json({
        success: false,
        message: 'Name, category and unit are required'
      });
    }

    const equipmentType = await EquipmentType.create({
      name,
      category,
      unit,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Equipment type created successfully',
      data: equipmentType
    });
  } catch (error) {
    next(error);
  }
};

// Get All Equipment Types
export const getEquipmentTypes = async (req, res, next) => {
  try {
    const equipmentTypes = await EquipmentType.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: equipmentTypes
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Equipment Type
export const getEquipmentTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const equipmentType = await EquipmentType.findByPk(id);

    if (!equipmentType) {
      return res.status(404).json({
        success: false,
        message: 'Equipment type not found'
      });
    }

    res.json({
      success: true,
      data: equipmentType
    });
  } catch (error) {
    next(error);
  }
};
