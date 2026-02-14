import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Base = sequelize.define('Base', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'bases',
  timestamps: true
});

export default Base;
