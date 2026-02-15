import Base from '../models/Base.js';

export const createBase = async (req, res) => {
  try {
    const { name, code, location } = req.body;

    const existing = await Base.findOne({ where: { code } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Base with this code already exists'
      });
    }

    const base = await Base.create({ name, code, location });

    res.status(201).json({
      success: true,
      message: 'Base created successfully',
      data: base
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating base',
      error: error.message
    });
  }
};

export const getBases = async (req, res) => {
  try {
    const bases = await Base.findAll();

    res.json({
      success: true,
      data: bases
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bases',
      error: error.message
    });
  }
};

export const getBaseById = async (req, res) => {
  try {
    const base = await Base.findByPk(req.params.id);

    if (!base) {
      return res.status(404).json({
        success: false,
        message: 'Base not found'
      });
    }

    res.json({
      success: true,
      data: base
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching base',
      error: error.message
    });
  }
};
