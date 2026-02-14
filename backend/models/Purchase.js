import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Purchase = sequelize.define('Purchase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  equipmentTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  baseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unitCost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  totalCost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  vendor: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  purchaseOrderNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'purchases',
  timestamps: true,
  hooks: {
    beforeCreate: (purchase) => {
      purchase.totalCost = purchase.quantity * purchase.unitCost;
    },
    beforeUpdate: (purchase) => {
      if (purchase.changed('quantity') || purchase.changed('unitCost')) {
        purchase.totalCost = purchase.quantity * purchase.unitCost;
      }
    }
  }
});

export default Purchase;
