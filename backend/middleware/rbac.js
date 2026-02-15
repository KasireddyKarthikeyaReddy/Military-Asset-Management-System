// Role-Based Access Control Middleware

/* =====================================================
   ROLE CHECK
===================================================== */
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


/* =====================================================
   BASE ACCESS CONTROL
===================================================== */
export const requireBaseAccess = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const baseId =
      req.params.baseId ||
      req.body.baseId ||
      req.query.baseId;

    // ✅ Admin → Full access
    if (user.role === 'admin') {
      return next();
    }

    // ✅ Base Commander → Only their assigned base
    if (user.role === 'base_commander') {
      if (!user.baseId) {
        return res.status(403).json({
          success: false,
          message: 'Base Commander not assigned to any base.'
        });
      }

      if (baseId && Number(baseId) !== Number(user.baseId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this base.'
        });
      }

      // Force baseId to their base
      req.body.baseId = user.baseId;
      req.query.baseId = user.baseId;

      return next();
    }

    // ✅ Logistics Officer → Only their assigned base
    if (user.role === 'logistics_officer') {
      if (!user.baseId) {
        return res.status(403).json({
          success: false,
          message: 'Logistics Officer not assigned to any base.'
        });
      }

      if (baseId && Number(baseId) !== Number(user.baseId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this base.'
        });
      }

      // Force base restriction
      req.body.baseId = user.baseId;
      req.query.baseId = user.baseId;

      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Unauthorized role.'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization error.',
      error: error.message
    });
  }
};


/* =====================================================
   AUTOMATIC BASE FILTER FOR QUERIES
===================================================== */
export const filterByBase = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next();
  }

  // Admin → See everything
  if (user.role === 'admin') {
    return next();
  }

  // Base Commander & Logistics → Only their base
  if (user.baseId) {
    req.query.baseId = user.baseId;

    // Prevent body manipulation
    if (req.body.baseId && Number(req.body.baseId) !== Number(user.baseId)) {
      req.body.baseId = user.baseId;
    }
  }

  next();
};
