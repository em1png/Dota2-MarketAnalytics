import axios from "axios";
import { makeRequestThrowProxy } from "../utils/utils.js";

export const getSteamHistoryByDays = async (itemName) => {
    try {
        const data = await makeRequestThrowProxy(`https://steamcommunity.com/market/pricehistory/?currency=5&appid=570&market_hash_name=${itemName}`);

        const newData = data.prices
            .filter((item) => parseInt(item[0].substr(7, 4)) >= 2021)
            .reverse();

        const dataByDay = newData.reduce((acc, value) => {
            const currentDate = value[0].substr(0, 11);
            const existingEntry = acc.find(
                (entry) => entry[0].substr(0, 11) === currentDate
            );

            if (existingEntry) {
                const [date, price, count] = existingEntry;
                const newValue = value[1] * parseInt(value[2]);
                const totalValue = price * parseInt(count) + newValue;
                const totalCount = parseInt(count) + parseInt(value[2]);

                existingEntry[1] = parseInt((totalValue / totalCount).toFixed(3));
                existingEntry[2] = parseInt(totalCount);
            } else {
                acc.push([currentDate, parseInt(value[1]), parseInt(value[2])]);
            }

            return acc;
        }, []);

        return dataByDay.slice(1);
    } catch (error) {
        throw(`getHistoryByDays fetch error: ${error}`)
    }
};

export const getSteamMarketItemId = async (itemName) => {
    try {
        const data = await makeRequestThrowProxy(`https://steamcommunity.com/market/listings/570/${itemName}`);

        const dataString = String(data);
        const matches = dataString.match(/Market_LoadOrderSpread\(\s*(\d+)\s*\)/);

        if (matches) return matches[1];
        else throw new Error(`Item ID is empty — ${matches}`);
    } catch (error) {
        console.error(`[ERROR] getSteamMarketItemId: ${error}`);
        return false;
    }
};

export const getCurrentPrice = async (itemName) => {
    try {
        const data = await makeRequestThrowProxy(`https://steamcommunity.com/market/priceoverview/?appid=570&currency=5&market_hash_name=${itemName}`);

        if (!data) {
            throw ("Data is empty");
        }
        
        return data;
    } catch (error) {
        console.error(`[ERROR] getCurrentPrice: ${error}`);
    }
};
