import Asset from '../models/Asset.js';
import Purchase from '../models/Purchase.js';
import Transfer from '../models/Transfer.js';
import Assignment from '../models/Assignment.js';
import Expenditure from '../models/Expenditure.js';

export const getDashboardData = async (req, res, next) => {
  try {

    const openingBalance = await Asset.count();
    const closingBalance = await Asset.count();
    const totalPurchases = await Purchase.sum('quantity') || 0;
    const assignedAssets = await Assignment.count({ where: { isActive: true } });
    const expendedAssets = await Expenditure.count();

    res.json({
      success: true,
      data: {
        openingBalance,
        closingBalance,
        netMovement: {
          total: totalPurchases,
          purchases: totalPurchases,
          transferIn: 0,
          transferOut: 0
        },
        assignedAssets,
        expendedAssets
      }
    });

  } catch (error) {
    next(error);
  }
};
