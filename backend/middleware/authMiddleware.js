// external code
const jwt = require('jsonwebtoken')

function protect(req, res, next) {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied' })
    }
    const token = authHeader.split(' ')[1]
    try {
        const dec = jwt.verify(token, process.env.JWT_SECRET)
        req.user = dec
        next()
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' })
    }
}

function adminOnly(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next()
    }
    else {
        res.status(403).json({ message: 'Access denied, admin only' })
    }
}

module.exports = {protect, adminOnly}