import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  serialNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  equipmentTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  baseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'assigned', 'expended', 'transferred'),
    allowNull: false,
    defaultValue: 'available'
  },
  purchaseId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'assets',
  timestamps: true
});

export default Asset;
