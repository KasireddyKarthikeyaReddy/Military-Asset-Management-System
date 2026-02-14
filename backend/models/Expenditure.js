import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Expenditure = sequelize.define('Expenditure', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  expenditureDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  disposalMethod: {
    type: DataTypes.ENUM('destroyed', 'sold', 'scrapped', 'lost', 'other'),
    allowNull: false
  },
  disposalValue: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  markedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'expenditures',
  timestamps: true
});

export default Expenditure;
