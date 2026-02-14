import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  entityType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  method: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  endpoint: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  requestBody: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  responseStatus: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['entityType', 'entityId']
    },
    {
      fields: ['createdAt']
    }
  ]
});

export default AuditLog;
