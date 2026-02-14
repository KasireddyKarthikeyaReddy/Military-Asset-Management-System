import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/database.js';
import User from '../models/User.js';
import Base from '../models/Base.js';
import EquipmentType from '../models/EquipmentType.js';
import Asset from '../models/Asset.js';
import Purchase from '../models/Purchase.js';
import Transfer from '../models/Transfer.js';
import Assignment from '../models/Assignment.js';
import Expenditure from '../models/Expenditure.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    console.log('🔄 Syncing database (dropping & recreating tables)...');
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // =========================
    // Create Bases
    // =========================
    console.log('🔄 Seeding bases...');
    const bases = await Base.bulkCreate([
      { name: 'Fort Bragg', code: 'FB', location: 'North Carolina, USA', isActive: true },
      { name: 'Fort Benning', code: 'FBN', location: 'Georgia, USA', isActive: true },
      { name: 'Fort Hood', code: 'FH', location: 'Texas, USA', isActive: true },
      { name: 'Naval Base San Diego', code: 'NBSD', location: 'California, USA', isActive: true }
    ]);
    console.log(`✅ Created ${bases.length} bases`);

    // =========================
    // Create Equipment Types
    // =========================
    console.log('🔄 Seeding equipment types...');
    const equipmentTypes = await EquipmentType.bulkCreate([
      { name: 'Rifle', code: 'RFL', description: 'Standard issue rifle', isActive: true },
      { name: 'Helmet', code: 'HLM', description: 'Combat helmet', isActive: true },
      { name: 'Body Armor', code: 'BDA', description: 'Protective body armor', isActive: true },
      { name: 'Radio', code: 'RAD', description: 'Communication radio', isActive: true },
      { name: 'Night Vision Goggles', code: 'NVG', description: 'Night vision equipment', isActive: true }
    ]);
    console.log(`✅ Created ${equipmentTypes.length} equipment types`);

    // =========================
    // Create Users (WITH HASHED PASSWORDS)
    // =========================
    console.log('🔄 Seeding users...');

    const hashedAdmin = await bcrypt.hash('admin123', 10);
    const hashedCommander = await bcrypt.hash('commander123', 10);
    const hashedLogistics = await bcrypt.hash('logistics123', 10);

    const users = await User.bulkCreate([
      {
        username: 'admin',
        email: 'admin@military.gov',
        password: hashedAdmin,
        role: 'admin',
        fullName: 'System Administrator',
        isActive: true
      },
      {
        username: 'commander1',
        email: 'commander1@military.gov',
        password: hashedCommander,
        role: 'base_commander',
        baseId: bases[0].id,
        fullName: 'Base Commander Fort Bragg',
        isActive: true
      },
      {
        username: 'commander2',
        email: 'commander2@military.gov',
        password: hashedCommander,
        role: 'base_commander',
        baseId: bases[1].id,
        fullName: 'Base Commander Fort Benning',
        isActive: true
      },
      {
        username: 'logistics1',
        email: 'logistics1@military.gov',
        password: hashedLogistics,
        role: 'logistics_officer',
        fullName: 'Logistics Officer',
        isActive: true
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    // =========================
    // Create Purchases
    // =========================
    console.log('🔄 Seeding purchases...');
    const purchases = await Purchase.bulkCreate([
      {
        purchaseDate: new Date('2024-01-15'),
        equipmentTypeId: equipmentTypes[0].id,
        baseId: bases[0].id,
        quantity: 50,
        unitCost: 850.00,
        totalCost: 42500.00,
        vendor: 'Weapons Supply Co.',
        purchaseOrderNumber: 'PO-2024-001',
        notes: 'Standard issue rifles',
        createdBy: users[3].id
      },
      {
        purchaseDate: new Date('2024-02-10'),
        equipmentTypeId: equipmentTypes[1].id,
        baseId: bases[0].id,
        quantity: 100,
        unitCost: 250.00,
        totalCost: 25000.00,
        vendor: 'Protection Equipment Inc.',
        purchaseOrderNumber: 'PO-2024-002',
        notes: 'Combat helmets',
        createdBy: users[3].id
      },
      {
        purchaseDate: new Date('2024-02-20'),
        equipmentTypeId: equipmentTypes[2].id,
        baseId: bases[1].id,
        quantity: 75,
        unitCost: 1200.00,
        totalCost: 90000.00,
        vendor: 'Armor Systems Ltd.',
        purchaseOrderNumber: 'PO-2024-003',
        notes: 'Body armor vests',
        createdBy: users[3].id
      }
    ]);

    console.log(`✅ Created ${purchases.length} purchases`);

    // =========================
    // Create Assets
    // =========================
    console.log('🔄 Seeding assets...');
    const assets = [];

    for (const purchase of purchases) {
      const equipmentType = equipmentTypes.find(et => et.id === purchase.equipmentTypeId);
      const base = bases.find(b => b.id === purchase.baseId);

      for (let i = 0; i < purchase.quantity; i++) {
        const asset = await Asset.create({
          serialNumber: `${equipmentType.code}-${base.code}-${Date.now()}-${i + 1}`,
          equipmentTypeId: purchase.equipmentTypeId,
          baseId: purchase.baseId,
          status: 'available',
          purchaseId: purchase.id,
          purchaseDate: purchase.purchaseDate,
          cost: purchase.unitCost
        });
        assets.push(asset);
      }
    }

    console.log(`✅ Created ${assets.length} assets`);

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Admin: admin@military.gov / admin123');
    console.log('Base Commander: commander1@military.gov / commander123');
    console.log('Logistics Officer: logistics1@military.gov / logistics123');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
