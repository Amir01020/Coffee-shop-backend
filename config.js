import "dotenv/config";

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Переменная окружения ${name} не задана. Скопируйте .env.example в .env и заполните.`
    );
  }
  return value;
}

export const JWT_SECRET = required("JWT_SECRET");
export const PORT = Number(process.env.PORT) || 3000;
export const HOST = process.env.HOST || "127.0.0.1";

export const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: required("DB_USER"),
  password: process.env.DB_PASSWORD || "",
  database: required("DB_NAME"),
};
