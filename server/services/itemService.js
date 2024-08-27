import itemModel from "../models/itemModel.js";
import { getCurrentPrice, getSteamHistoryByDays, getSteamMarketItemId } from "../services/steamApi.js";
import { sortSteamHistoryByWeeks } from "../utils/formatting.js";
import { logger } from "../utils/logger.js";

export const createItem = async (itemName, heroName, imageUrl) => {
    try {
        const item = await itemModel.findOne({ itemName: itemName });
        if (item) {
            throw ("Item already created")
        }

        const steamId = await getSteamMarketItemId(itemName);
        if (!steamId) {
            throw (`Cant get Steam ID, item was not created — ${itemName}.`)
        }

        const steamPrice = await getCurrentPrice(itemName);
        if (!steamPrice) {
            throw (`Cant get current price, item was not created — ${itemName}.`)
        }

        const dataByDays = await getSteamHistoryByDays(itemName);
        if (!dataByDays) {
            throw (`Cant get price history, item was not created — ${itemName}.`)
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
        return savedItem;
    } catch (err) {
        logger.error(`Create Item error: ${err}`);
    }
};

export const updateItem = async (itemId) => {
    try {
        // Находит предмет в БД
        const item = await itemModel.findById(itemId);
        if (!item) {
            throw new Error(`Item not found — ${itemId}.`)
        }

        // Получаем актуальную цену
        const steamPrice = await getCurrentPrice(item.itemName);
        if (!steamPrice) {
            throw new Error(`Cant get current price, item was not updated — ${item.itemName}.`)
        };

        item.steamMarket.price = parseInt(steamPrice.lowest_price)

        // Получаем историю
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

        const savedItem = await item.save();
        console.log(`Updated — ${item.itemName}`)
        return savedItem;
    } catch (err) {
        logger.error("Update Item error:", err);
        return err;
    }
};

export const directUpdateAll = async () => {
    try {
        const itemsArr = await itemModel.find().exec();
        if (!itemsArr) {
            throw ("Items not found")
        }

        for (let i = 0; i < itemsArr.length; i++) {
            let currentItem = itemsArr[i];
            await updateItem(currentItem._id)
        }

        return console.log('All items was successfully updated!')
    } catch (err) {
        logger.error("Update Item error:", err);
        return err;
    }
}