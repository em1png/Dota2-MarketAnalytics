import itemModel from "../models/itemModel.js";
import { getCurrentPrice, getSteamHistoryByDays, getSteamMarketItemId } from "../services/steamApi.js";
import { sortSteamHistoryByWeeks } from "../utils/formatting.js";
import { logger } from "../utils/logger.js";

// Создание предмета
export const create = async (req, res) => {
    try {
        const { heroName, itemName, imageUrl } = req.body;
        const item = await itemModel.findOne({ itemName: itemName });
        if (item) {
            return res.status(404).json({ message: "Item already created" });
        }

        const steamId = await getSteamMarketItemId(itemName);
        if (!steamId) {
            throw new Error(`Cant get Steam ID, item was not created — ${itemName}.`)
        }

        const steamPrice = await getCurrentPrice(itemName);
        if (!steamPrice) {
            throw new Error(`Cant get current price, item was not created — ${itemName}.`)
        }

        const dataByDays = await getSteamHistoryByDays(itemName);
        if (!dataByDays) {
            throw new Error(`Cant get price history, item was not created — ${itemName}.`)
        }

        // Dota2 Market API
        // const { data } = await d2marketGetCurrentPrice(itemName);

        const dataByWeeks = sortSteamHistoryByWeeks(dataByDays);

        const maxWeeks = Math.min(150, dataByWeeks.length);
        const maxWeeksYear = Math.min(52, dataByWeeks.length);

        const dataByWeeksAlltime = dataByWeeks.slice(0, maxWeeks);
        const dataByWeeksYear = dataByWeeks.slice(0, maxWeeksYear);

        const newItem = new itemModel({
            heroName: heroName,
            itemName: itemName,
            imageUrl: imageUrl,
            classId: null,
            instanceId: null,
            type: null,
            nameColor: null,
            steamMarket: {
                price: parseInt(steamPrice.lowest_price),
                quantity: null,
                marketId: parseInt(steamId),
                minBuyOrder: null,
                data: {
                    byWeeksData: dataByWeeksAlltime,
                    monthData: dataByDays.slice(1, 31),
                },
                stats: {
                    minPriceYear: dataByWeeksYear.reduce((acc, value) => Math.min(acc, value[1]), 99999),
                    maxPriceYear: dataByWeeksYear.reduce((acc, value) => Math.max(acc, value[1]), 0),
                    averagePriceYear: Math.round(dataByWeeksYear.reduce((acc, value) => acc + value[1], 0) / maxWeeksYear),
                    averageSalesYear: Math.round(dataByWeeksYear.reduce((acc, value) => acc + value[2], 0) / maxWeeksYear),
                }
            }
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        logger.error("Create Item error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Изменение предмета
export const update = async (req, res) => {
    try {
        const item = await itemModel.findById(req.params.id);
        if (!item) {
            throw new Error(`Item not found — ${req.params.id}.`)
        }

        if (req.body.steamCurrentPrice) {
            const steamPrice = await getCurrentPrice(item.itemName);
            if (!steamPrice) {
                throw new Error(`Cant get current price, item was not updated — ${item.itemName}.`)
            };

            item.steamMarket.price = parseInt(steamPrice.lowest_price)
        };

        // Dota2 Market
        //   if(req.body.d2marketCurrentPrice) {
        //     const data = await d2marketGetCurrentPrice(item.itemName);
        //     if(!data.length) {
        //       throw new Error(`Dota2Market items list is empty — ${item.itemName}.`)
        //     }

        //     item.price.d2market = parseInt(data[0].price.toString().replace(/(\d{2})$/, ",$1"))
        //   };

        if (req.body.steamGeneralData) {
            const dataByDays = await getSteamHistoryByDays(item.itemName);
            if (!dataByDays) {
                throw new Error(`Cant get price history, item was not updated — ${item.itemName}.`)
            }

            const dataByWeeks = sortSteamHistoryByWeeks(dataByDays);

            const maxWeeks = Math.min(150, dataByWeeks.length);
            const maxWeeksYear = Math.min(52, dataByWeeks.length);

            const dataByWeeksAlltime = dataByWeeks.slice(0, maxWeeks);
            const dataByWeeksYear = dataByWeeks.slice(0, maxWeeksYear);

            item.steamMarket.data.byWeeksData = dataByWeeksAlltime;
            item.steamMarket.data.monthData = dataByDays.slice(1, 31);
            item.steamMarket.stats.minPriceYear = dataByWeeksYear.reduce((acc, value) => Math.min(acc, value[1]), 99999);
            item.steamMarket.stats.maxPriceYear = dataByWeeksYear.reduce((acc, value) => Math.max(acc, value[1]), 0);
            item.steamMarket.stats.averagePriceYear = Math.round(dataByWeeksYear.reduce((acc, value) => acc + value[1], 0) / maxWeeksYear);
            item.steamMarket.stats.averageSalesYear = Math.round(dataByWeeksYear.reduce((acc, value) => acc + value[2], 0) / maxWeeksYear);
        };

        const savedItem = await item.save();
        console.log(`Updated — ${item.itemName}`)
        return res.status(200).json(savedItem);
    } catch (err) {
        logger.error(`Update Item error: ${err}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Удаление предмета
export const remove = async (req, res) => {
    try {
        const item = await itemModel.findOne({ _id: req.params.id });
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const deleteItem = await item.deleteOne();
        res.status(200).json(deleteItem);
    } catch (err) {
        logger.error("Remove Item error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Получить один предмет
export const getOne = async (req, res) => {
    try {
        const item = await itemModel.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(item);
    } catch (err) {
        logger.error("Get one item error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Получить все предметы
export const getAll = async (req, res) => {
    try {
        const items = await itemModel.find().exec();
        if (!items) {
            return res.status(404).json({ message: "Items not found" });
        }

        res.status(200).json(items);
    } catch (err) {
        logger.error("Get all items error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};