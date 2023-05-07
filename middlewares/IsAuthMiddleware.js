import jwt from 'jsonwebtoken';

export const isAuthMiddleware = (req, res, next) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if (!token) throw ({code: 401, message: 'Unauthorized.'})

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userId = decodedToken._id;

        next();
    } catch (e) {
        return res.status(e.code || 401).json({
            message: e.message,
        });
    }
}