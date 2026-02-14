import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Transfer = sequelize.define('Transfer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transferDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  fromBaseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  toBaseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  transferType: {
    type: DataTypes.ENUM('transfer_in', 'transfer_out'),
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  transferNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'transfers',
  timestamps: true
});

export default Transfer;
