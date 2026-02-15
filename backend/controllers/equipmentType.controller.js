import EquipmentType from '../models/EquipmentType.js';

// Create Equipment Type
export const createEquipmentType = async (req, res, next) => {
  try {
    const { name, code, category, unit, description } = req.body;

    // Basic validation
    if (!name || !code || !category || !unit) {
      return res.status(400).json({
        success: false,
        message: 'Name, code, category and unit are required'
      });
    }

    const equipmentType = await EquipmentType.create({
      name,
      code,
      category,
      unit,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Equipment type created successfully',
      data: { equipmentType }
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
      data: { equipmentTypes }
    });

  } catch (error) {
    next(error);
  }
};
