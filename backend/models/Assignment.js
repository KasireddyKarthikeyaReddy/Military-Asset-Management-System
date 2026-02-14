import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  personnelName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  personnelId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  personnelRank: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  assignmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  assignedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'assignments',
  timestamps: true
});

export default Assignment;
