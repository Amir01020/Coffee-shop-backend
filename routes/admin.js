import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAdminByLogin, createAdmin } from '../models/adminModel.js';

const router = express.Router();
const JWT_SECRET = 'your-secret-key';

// Логин администратора
router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const admin = await getAdminByLogin(login);
    if (!admin) return res.status(401).json({ message: 'Неверный логин' });

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) return res.status(401).json({ message: 'Неверный пароль' });

    const token = jwt.sign({ id: admin.id, login: admin.login }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создание администратора (только для разработки/админки)
router.post('/register', async (req, res) => {
  const { login, password } = req.body;

  try {
    // Проверка существования администратора
    const existingAdmin = await getAdminByLogin(login);
    if (existingAdmin) {
      return res.status(400).json({ message: 'Администратор уже существует' });
    }
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание администратора (добавьте createAdmin в adminModel.js)
    await createAdmin(login, hashedPassword);

    res.status(201).json({ message: 'Администратор создан' });

  } catch (error) {
    console.error('Ошибка при создании администратора:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;