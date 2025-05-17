import jwt from 'jsonwebtoken';
const JWT_SECRET = 'your-secret-key';

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Неверный токен' });
  }
};

export default auth;
