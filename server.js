import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.js";
import path from "path";
import adminRoutes from './routes/admin.js';
import { fileURLToPath } from "url";

// Получаем __dirname аналога
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/products", productRoutes);
app.use('/admin', adminRoutes);
app.listen(3000, () => {
  console.log("Сервер запущен на http://localhost:3000");
});
