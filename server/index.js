import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import https from "https"

import { logger } from "./utils/logger.js";
import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import userOwnedItemRoutes from "./routes/userOwnedItemRoutes.js";
import userSoldItemRoutes from "./routes/userSoldItemRoutes.js";

// Инициализация
dotenv.config();
const app = express();

// Routes
app.use(express.json());
app.use(cors());
app.use('/api', userRoutes);
app.use('/api', itemRoutes);
app.use('/api/owneditems', userOwnedItemRoutes);
app.use('/api', userSoldItemRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).send('Something broke!');
});

// Подключения к базе данных
const connectToDatabase = async () => {
    if (!process.env.MONGO_DB) {
        logger.error("MONGO_DB environment variable is not set.");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_DB);
        logger.info("[+] Database connected!");
    } catch (err) {
        logger.error("Error during database connection:", err);
        process.exit(1);
    }
};

// Запуска сервера
const startServer = () => {
    const PORT = process.env.PORT || 443; // Используем порт 443 для HTTPS

    // Путь к сертификату и ключу
    const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/emone.ru/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/emone.ru/fullchain.pem')
    };

    // Создание HTTPS-сервера
    https.createServer(options, app).listen(PORT, (err) => {
        if (err) {
            return logger.error("[-] Error starting server:", err);
        }
        logger.info(`[+] Server running on port ${PORT} (HTTPS)!`);
    });
};

// Запуск всего приложения
const init = async () => {
    await connectToDatabase();
    startServer();
};

// Вызываем
init().catch(err => logger.error("[-] Error during application initialization:", err));

process.on('SIGINT', async () => {
    logger.info("Shutting down server...");
    await mongoose.connection.close();
    process.exit(0);
});