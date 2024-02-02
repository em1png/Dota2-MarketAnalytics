// Все функции для доступа к Steam API.
// 1. getSteamHistoryByDays - получить историю цен по дням.
// 2. getSteamMarketItemId - получить ID предмета на маркете.
// 3. getSteamCurrentPrice - получить текущую цену на маркете.

import { cookieSteam } from "../config/authorization.js";
import { makeRequestWithProxies } from "../utils/utils.js";

// Limits
let steamHistoryApiQueries = 0;
setInterval(() => steamHistoryApiQueries = 0, 60000);

//

export const getSteamHistoryByDays = async (itemName) => {
  try {
    if(steamHistoryApiQueries >= 20) {
      console.error(`steamHistoryApiQueries limit = ${steamHistoryApiQueries}`);
      await new Promise(resolve => setTimeout(resolve, 10000));
      return getSteamHistoryByDays(itemName)
    };

    const data = await makeRequestWithProxies({
      url: `https://steamcommunity.com/market/pricehistory/?currency=5&appid=570&market_hash_name=${itemName}`,
      api: "steamPriceHistory",
      options: { headers: { Cookie: cookieSteam } }
    });

    if (!data) {
      throw new Error("All proxies failed to PriceHistory API");
    }

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
    console.log(`getHistoryByDays fetch error: ${error}`);
    return false;
  }
};

export const getSteamMarketItemId = async (itemName) => {
  try {
    const data = await makeRequestWithProxies({
      url: `https://steamcommunity.com/market/listings/570/${itemName}`,
    });

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
    const data = await makeRequestWithProxies({
      url: `https://steamcommunity.com/market/priceoverview/?appid=570&currency=5&market_hash_name=${itemName}`,
      api: "steamPriceOverview",
    });
    if (!data) {
      throw new Error("All proxies failed to PriceOverview API");
    }
    return data;
  } catch (error) {
    console.error(`[ERROR] getCurrentPrice: ${error}`);
    return false;
  }
};
