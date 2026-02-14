// Role-Based Access Control Middleware

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions for this action.' 
      });
    }

    next();
  };
};

// Middleware to check if user can access a specific base
export const requireBaseAccess = async (req, res, next) => {
  try {
    const user = req.user;
    const baseId = req.params.baseId || req.body.baseId || req.query.baseId;

    // Admin has access to all bases
    if (user.role === 'admin') {
      return next();
    }

    // Base Commander can only access their assigned base
    if (user.role === 'base_commander') {
      if (!user.baseId) {
        return res.status(403).json({ 
          success: false, 
          message: 'Base Commander not assigned to any base.' 
        });
      }
      
      if (baseId && parseInt(baseId) !== user.baseId) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied to this base.' 
        });
      }
      
      // Set baseId in request for base commanders
      req.user.baseId = user.baseId;
      return next();
    }

    // Logistics Officer has access to all bases for purchases and transfers
    if (user.role === 'logistics_officer') {
      return next();
    }

    return res.status(403).json({ 
      success: false, 
      message: 'Insufficient permissions.' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Authorization error.', 
      error: error.message 
    });
  }
};

// Middleware to filter data based on role
export const filterByBase = (req, res, next) => {
  const user = req.user;
  
  // Admin and Logistics Officer see all bases
  if (user.role === 'admin' || user.role === 'logistics_officer') {
    return next();
  }
  
  // Base Commander only sees their base
  if (user.role === 'base_commander' && user.baseId) {
    req.query.baseId = user.baseId;
    if (req.body.baseId) {
      // Don't allow base commanders to change baseId in body
      req.body.baseId = user.baseId;
    }
  }
  
  next();
};
