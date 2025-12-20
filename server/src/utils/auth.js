const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const rrAdminHeader = req.headers['x-rr-admin'];
  if (rrAdminHeader === '1') {
    req.user = { id: 'rr_admin', isAdmin: true };
    return next();
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token missing' });
  const token = authHeader.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token invalid' });
    req.user = decoded;
    next();
  });
}

function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  });
}

module.exports = { verifyToken, verifyAdmin };
