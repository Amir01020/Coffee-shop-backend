import db from '../db.js';
import bcrypt from 'bcrypt';

export const getAdminByLogin = async (login) => {
  try {
    // Выбираем только необходимые поля (без лишних данных)
    const [rows] = await db.query(
      'SELECT id, login, password FROM admins WHERE login = ? LIMIT 1', 
      [login]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching admin:', error);
    throw new Error('Database error');
  }
};

export const createAdmin = async (login, password) => {
  try {
    const [result] = await db.query(
      'INSERT INTO admins (login, password) VALUES (?, ?)',
      [login, password]
    );
    
    return {
      id: result.insertId,
      login,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error creating admin:', error);
    throw new Error('Database error');
  }
};

// Дополнительные полезные методы
export const deleteAdmin = async (id) => {
  await db.query('DELETE FROM admins WHERE id = ?', [id]);
};

export const getAllAdmins = async () => {
  const [rows] = await db.query('SELECT id, login, created_at FROM admins');
  return rows;
};