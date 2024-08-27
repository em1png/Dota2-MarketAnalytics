import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

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
    const PORT = process.env.PORT || 4445;
    app.listen(PORT, (err) => {
        if (err) {
            return logger.error("[-] Error starting server:", err);
        }
        logger.info(`[+] Server running on port ${PORT}!`);
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