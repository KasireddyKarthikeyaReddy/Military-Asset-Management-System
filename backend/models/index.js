import User from './User.js';
import Base from './Base.js';
import EquipmentType from './EquipmentType.js';
import Asset from './Asset.js';
import Purchase from './Purchase.js';
import Transfer from './Transfer.js';
import Assignment from './Assignment.js';
import Expenditure from './Expenditure.js';
import AuditLog from './AuditLog.js';

// =====================
// User ↔ Base
// =====================
User.belongsTo(Base, { foreignKey: 'baseId', as: 'base' });
Base.hasMany(User, { foreignKey: 'baseId', as: 'users' });

// =====================
// Purchase ↔ Base
// =====================
Purchase.belongsTo(Base, { foreignKey: 'baseId', as: 'base' });
Base.hasMany(Purchase, { foreignKey: 'baseId', as: 'purchases' });

// =====================
// Purchase ↔ EquipmentType
// =====================
Purchase.belongsTo(EquipmentType, { foreignKey: 'equipmentTypeId', as: 'equipmentType' });
EquipmentType.hasMany(Purchase, { foreignKey: 'equipmentTypeId', as: 'purchases' });

// =====================
// Purchase ↔ User (creator)
// =====================
Purchase.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Purchase, { foreignKey: 'createdBy', as: 'createdPurchases' });

// =====================
// Asset ↔ Base
// =====================
Asset.belongsTo(Base, { foreignKey: 'baseId', as: 'base' });
Base.hasMany(Asset, { foreignKey: 'baseId', as: 'assets' });

// =====================
// Asset ↔ EquipmentType
// =====================
Asset.belongsTo(EquipmentType, { foreignKey: 'equipmentTypeId', as: 'equipmentType' });
EquipmentType.hasMany(Asset, { foreignKey: 'equipmentTypeId', as: 'assets' });

// =====================
// Asset ↔ Purchase
// =====================
Asset.belongsTo(Purchase, { foreignKey: 'purchaseId', as: 'purchase' });
Purchase.hasMany(Asset, { foreignKey: 'purchaseId', as: 'assets' });

// =====================
// Transfer ↔ Asset
// =====================
Transfer.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });
Asset.hasMany(Transfer, { foreignKey: 'assetId', as: 'transfers' });

// =====================
// Transfer ↔ Base (VERY IMPORTANT)
// =====================
Transfer.belongsTo(Base, { foreignKey: 'fromBaseId', as: 'fromBase' });
Transfer.belongsTo(Base, { foreignKey: 'toBaseId', as: 'toBase' });

Base.hasMany(Transfer, { foreignKey: 'fromBaseId', as: 'outgoingTransfers' });
Base.hasMany(Transfer, { foreignKey: 'toBaseId', as: 'incomingTransfers' });

// =====================
// Transfer ↔ User (creator)
// =====================
Transfer.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Transfer, { foreignKey: 'createdBy', as: 'createdTransfers' });

// =====================
// Assignment ↔ Asset
// =====================
Assignment.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });
Asset.hasMany(Assignment, { foreignKey: 'assetId', as: 'assignments' });

// Assignment ↔ User (assigner)
Assignment.belongsTo(User, { foreignKey: 'assignedBy', as: 'assigner' });
User.hasMany(Assignment, { foreignKey: 'assignedBy', as: 'assignedAssets' });

// =====================
// Expenditure ↔ Asset
// =====================
Expenditure.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });
Asset.hasMany(Expenditure, { foreignKey: 'assetId', as: 'expenditures' });

// Expenditure ↔ User (marker)
Expenditure.belongsTo(User, { foreignKey: 'markedBy', as: 'marker' });
User.hasMany(Expenditure, { foreignKey: 'markedBy', as: 'markedExpenditures' });

// =====================
// AuditLog ↔ User
// =====================
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });

export {
  User,
  Base,
  EquipmentType,
  Asset,
  Purchase,
  Transfer,
  Assignment,
  Expenditure,
  AuditLog
};
