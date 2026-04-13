const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    let token = req.cookies.token;
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7); 
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    } 
    
    jwt.verify(token, process.env.SECRET_KEY , (err, user) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(403).json({ message: 'Invalid or expired token' });
        } 
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;