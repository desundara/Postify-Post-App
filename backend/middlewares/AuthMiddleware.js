const {verify} = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if (!accessToken) {
        return res.status(401).json({error: "User not logged in!"});
    }
    
    try {
        const secret = process.env.JWT_SECRET || "importantSecret";
        const validToken = verify(accessToken, secret);
        req.user = validToken;
        if (validToken) {
            return next();
        }
    } catch(err) {
        return res.status(403).json({ error: err.message });
    }
};

module.exports = { validateToken };