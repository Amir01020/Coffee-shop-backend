import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import db from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Получение абсолютного пути текущей директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Настройка хранения изображений
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads/products"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });

/**
 * CREATE product (только для авторизованных)
 */
router.post("/", auth, upload.single("img"), async (req, res) => {
  try {
    const { name, type, key, price, priceNds, comment, productInfo } = req.body;
    const img = req.file ? `/uploads/products/${req.file.filename}` : null;

    const result = await db.query(
      "INSERT INTO products (name, type, `key`, price, priceNds, comment, productInfo, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        type,
        key,
        price,
        priceNds,
        comment,
        productInfo,
        img,
      ]
    );

    res.json({ id: result.insertId });
  } catch (err) {
    console.error("Ошибка добавления продукта", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

/**
 * READ all products (публично)
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(
      rows.map((row) => ({
        ...row,
        productInfo: JSON.parse(row.productInfo),
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Ошибка чтения" });
  }
});

/**
 * READ one product (публично)
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Продукт не найден" });

    const product = rows[0];
    product.productInfo = JSON.parse(product.productInfo);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Ошибка чтения" });
  }
});

/**
 * UPDATE product (только для авторизованных)
 */
router.put("/:id", auth, upload.single("img"), async (req, res) => {
  try {
    const { name, type, key, price, priceNds, comment, productInfo } = req.body;
    const img = req.file ? `/uploads/products/${req.file.filename}` : null;

    const fields = [
      name,
      type,
      key,
      price,
      priceNds,
      comment,
      JSON.stringify(productInfo),
    ];

    const query = `
      UPDATE products SET
        name = ?, type = ?, \`key\` = ?, price = ?, priceNds = ?, comment = ?, productInfo = ?
        ${img ? ", img = ?" : ""}
      WHERE id = ?
    `;

    if (img) fields.push(img);
    fields.push(req.params.id);

    await db.query(query, fields);

    res.json({ message: "Обновлено" });
  } catch (err) {
    console.error("Ошибка обновления", err);
    res.status(500).json({ message: "Ошибка обновления" });
  }
});

/**
 * DELETE product (только для авторизованных)
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ message: "Удалено" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка удаления" });
  }
});

export default router;
