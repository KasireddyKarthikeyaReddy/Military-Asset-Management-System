import AuditLog from '../models/AuditLog.js';

export const auditLog = async (req, res, next) => {
  // Store original res.json
  const originalJson = res.json.bind(res);
  
  // Override res.json to capture response
  res.json = function(data) {
    // Log the request after response is sent (async, don't block)
    setImmediate(() => logRequest(req, res, data));
    return originalJson(data);
  };

  next();
};

const logRequest = async (req, res, responseData) => {
  try {
    // Skip logging for health checks and auth endpoints (to avoid logging passwords)
    if (req.path === '/api/health' || req.path.startsWith('/api/auth/login')) {
      return;
    }

    const action = getActionFromMethod(req.method);
    const entityType = getEntityTypeFromPath(req.path);
    
    await AuditLog.create({
      userId: req.user?.id || null,
      action: action,
      entityType: entityType,
      entityId: req.params.id || req.body.id || null,
      method: req.method,
      endpoint: req.path,
      requestBody: sanitizeRequestBody(req.body),
      responseStatus: res.statusCode,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });
  } catch (error) {
    // Don't fail the request if audit logging fails
    console.error('Audit logging error:', error);
  }
};

const getActionFromMethod = (method) => {
  const actions = {
    'GET': 'read',
    'POST': 'create',
    'PUT': 'update',
    'PATCH': 'update',
    'DELETE': 'delete'
  };
  return actions[method] || 'unknown';
};

const getEntityTypeFromPath = (path) => {
  const parts = path.split('/').filter(p => p && p !== 'api');
  return parts[0] || 'unknown';
};

const sanitizeRequestBody = (body) => {
  if (!body) return null;
  
  const sanitized = { ...body };
  
  // Remove sensitive fields
  if (sanitized.password) {
    sanitized.password = '[REDACTED]';
  }
  
  return sanitized;
};
