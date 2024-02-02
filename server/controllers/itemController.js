import { logger } from "../config/logger.js";
import itemModel from "../models/itemModel.js";
import { getCurrentPrice, getSteamHistoryByDays, getSteamMarketItemId } from "../api/steamApi.js";
import { sortSteamHistoryByWeeks} from "../utils/formatting.js"
import { d2marketGetCurrentPrice } from "../api/d2marketApi.js";
import { todayDate } from "../utils/constants.js";

export const create = async (req, res) => {
  try {
    const item = await itemModel.findOne({ itemName: itemName });
    if (item) {
      return res.status(404).json({ message: "Item already created" });
    }

    const steamId = await getSteamMarketItemId(itemName)
    if(!steamId) {
      throw new Error(`Cant get Steam ID, item was not created — ${itemName}.`)
    }

    const steamPrice = await getCurrentPrice(itemName);
    if(!steamPrice) {
      throw new Error(`Cant get current price, item was not created — ${itemName}.`)
    }

    const dataByDays = await getSteamHistoryByDays(itemName);
    if(!dataByDays) {
      throw new Error(`Cant get price history, item was not created — ${itemName}.`)
    }

    // Dota2 Market API
    const { data } = await d2marketGetCurrentPrice(itemName); 

    const dataByWeeks = sortSteamHistoryByWeeks(dataByDays);

    const maxWeeks = Math.min(150, dataByWeeks.length);
    const maxWeeksYear = Math.min(52, dataByWeeks.length);

    const dataByWeeksAlltime = dataByWeeks.slice(0, maxWeeks);
    const dataByWeeksYear = dataByWeeks.slice(0, maxWeeksYear);

    const newItem = new itemModel({
      heroName: heroName,
      itemName: itemName,
      imageUrl: imageUrl,

      price: {
        steam: parseInt(steamPrice.lowest_price),
        d2market: parseInt(data[0].price.toString().replace(/(\d{2})$/, ",$1")),
      },

      steamData: {
        marketId: parseInt(steamId),
        buyOrder: 0,
        byWeeksData: dataByWeeksAlltime,
        monthData: dataByDays.slice(1, 31),

        minPriceYear: dataByWeeksYear.reduce((acc, value) => Math.min(acc, value[1]), 99999),
        maxPriceYear: dataByWeeksYear.reduce((acc, value) => Math.max(acc, value[1]), 0),

        minPriceAlltime: dataByWeeksAlltime.reduce((acc, value) => Math.min(acc, value[1]), 99999),
        maxPriceAlltime: dataByWeeksAlltime.reduce((acc, value) => Math.max(acc, value[1]), 0),
  
        averagePriceYear: Math.round(dataByWeeksYear.reduce((acc, value) => acc + value[1], 0) / maxWeeksYear),
        averagePriceAlltime: Math.round(dataByWeeksAlltime.reduce((acc, value) => acc + value[1] ,0) / maxWeeks),
  
        averageSalesYear: Math.round(dataByWeeksYear.reduce((acc, value) => acc + value[2], 0) / maxWeeksYear),
        averageSalesAlltime: Math.round(dataByWeeksAlltime.slice(0, maxWeeks).reduce((acc, value) => acc + value[2] ,0) / maxWeeks),
      },
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    logger.error("Create Item error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

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

export const update = async (req, res) => {
  try {
    const item = await itemModel.findById(req.params.itemId);
    if (!item) {
      throw new Error(`Item not found — ${req.params.itemId}.`)
    }

    if(req.body.steamCurrentPrice) {
      const steamPrice = await getCurrentPrice(item.itemName);
      if(!steamPrice) {
        throw new Error(`Cant get current price, item was not updated — ${item.itemName}.`)
      };

      item.price.steam = parseInt(steamPrice.lowest_price)
    };

    // Dota2 Market
    if(req.body.d2marketCurrentPrice) {
      const data = await d2marketGetCurrentPrice(item.itemName);
      if(!data.length) {
        throw new Error(`Dota2Market items list is empty — ${item.itemName}.`)
      }

      item.price.d2market = parseInt(data[0].price.toString().replace(/(\d{2})$/, ",$1"))
    };

    if(req.body.steamGeneralData) {
      const dataByDays = await getSteamHistoryByDays(item.itemName);
      if(!dataByDays) {
        throw new Error(`Cant get price history, item was not updated — ${item.itemName}.`)
      }
  
      const dataByWeeks = sortSteamHistoryByWeeks(dataByDays);
  
      const maxWeeks = Math.min(150, dataByWeeks.length);
      const maxWeeksYear = Math.min(52, dataByWeeks.length);
  
      const dataByWeeksAlltime = dataByWeeks.slice(0, maxWeeks);
      const dataByWeeksYear = dataByWeeks.slice(0, maxWeeksYear);
  
      item.steamData.byWeeksData = dataByWeeksAlltime,
      item.steamData.monthData = dataByDays.slice(1, 31),
      item.steamData.minPriceYear = dataByWeeksYear.reduce((acc, value) => Math.min(acc, value[1]), 99999),
      item.steamData.maxPriceYear = dataByWeeksYear.reduce((acc, value) => Math.max(acc, value[1]), 0),
      item.steamData.minPriceAlltime = dataByWeeksAlltime.reduce((acc, value) => Math.min(acc, value[1]), 99999),
      item.steamData.maxPriceAlltime = dataByWeeksAlltime.reduce((acc, value) => Math.max(acc, value[1]), 0),
      item.steamData.averagePriceYear = Math.round(dataByWeeksYear.reduce((acc, value) => acc + value[1], 0) / maxWeeksYear),
      item.steamData.averagePriceAlltime = Math.round(dataByWeeksAlltime.reduce((acc, value) => acc + value[1] ,0) / maxWeeks),
      item.steamData.averageSalesYear = Math.round(dataByWeeksYear.reduce((acc, value) => acc + value[2], 0) / maxWeeksYear),
      item.steamData.averageSalesAlltime = Math.round(dataByWeeksAlltime.slice(0, maxWeeks).reduce((acc, value) => acc + value[2] ,0) / maxWeeks),
      item.steamData.updated = todayDate
    };

    const savedItem = await item.save();
    console.log(`Updated — ${item.itemName}`)
    return res.status(200).json(savedItem);
  } catch (err) {
    logger.error("Update Item error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export async function updateAll (req, res) {
  try {
    const itemsArr = await itemModel.find().exec();
    if (!itemsArr) {
      return res.status(404).json({ message: "Items not found" });
    }

    res.status(200).json({ message: "Starting update all items.."});
  
    for(let i = 0; i < itemsArr.length; i++) {
      let currentItem = itemsArr[i];
      let item = await directUpdate(currentItem._id, { steamCurrentPrice: true, d2marketCurrentPrice: true, steamGeneralData: true})

      if(!item) console.error(`Item update failed, skip - ${currentItem.itemName}`)
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    return console.log('All items was successfully updated!')
  } catch (err) {
    logger.error("Update all item error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

//----------------

export const directCreate = async (itemName, heroName, imageUrl, steamPrice, classid, instanceid, type, nameColor, sellListings) => {
  try {
    const item = await itemModel.findOne({ itemName: itemName });
    if (item) {
      throw new Error(`Item already created — ${itemName}.`)
    }

    const steamid = await getSteamMarketItemId(itemName);
    if(!steamid) {
      throw new Error(`Cant get current price, item was not created — ${itemName}.`)
    }

    const dataByDays = await getSteamHistoryByDays(itemName);
    if(!dataByDays) {
      throw new Error(`Cant get price history, item was not created — ${itemName}.`)
    }

    // Dota2 Market API
    const { data } = await d2marketGetCurrentPrice(itemName);
    const d2price = (data && data.length) ? parseInt(data[0].price.toString().replace(/(\d{2})$/, ",$1")) : -1;

    const dataByWeeks = sortSteamHistoryByWeeks(dataByDays);

    const maxWeeks = Math.min(150, dataByWeeks.length);
    const maxWeeksYear = Math.min(52, dataByWeeks.length);

    const dataByWeeksAlltime = dataByWeeks.slice(0, maxWeeks);
    const dataByWeeksYear = dataByWeeks.slice(0, maxWeeksYear);

    if(Math.round(dataByWeeksYear.reduce((acc, value) => acc + value[2], 0) / maxWeeksYear) < 10) return false;

    const newItem = new itemModel({
      heroName: heroName,
      itemName: itemName,
      imageUrl: imageUrl,
      classid: classid,
      instanceid: instanceid,
      type: type,
      nameColor: nameColor,

      price: {
        steam: parseInt(steamPrice),
        d2market: d2price
      },

      steamData: {
        marketId: parseInt(steamid),
        buyOrder: 0,
        sellListings: sellListings,
        byWeeksData: dataByWeeksAlltime,
        monthData: dataByDays.slice(1, 31),

        minPriceYear: dataByWeeksYear.reduce((acc, value) => Math.min(acc, value[1]), 99999),
        maxPriceYear: dataByWeeksYear.reduce((acc, value) => Math.max(acc, value[1]), 0),

        minPriceAlltime: dataByWeeksAlltime.reduce((acc, value) => Math.min(acc, value[1]), 99999),
        maxPriceAlltime: dataByWeeksAlltime.reduce((acc, value) => Math.max(acc, value[1]), 0),
  
        averagePriceYear: Math.round(dataByWeeksYear.reduce((acc, value) => acc + value[1], 0) / maxWeeksYear),
        averagePriceAlltime: Math.round(dataByWeeksAlltime.reduce((acc, value) => acc + value[1] ,0) / maxWeeks),
  
        averageSalesYear: Math.round(dataByWeeksYear.reduce((acc, value) => acc + value[2], 0) / maxWeeksYear),
        averageSalesAlltime: Math.round(dataByWeeksAlltime.slice(0, maxWeeks).reduce((acc, value) => acc + value[2] ,0) / maxWeeks),

        updated: todayDate,
      },
    });

    await newItem.save();
    console.log(`Saved — ${itemName}`)
    return true;
  } catch (err) {
    logger.error("Create Item error:", err);
    return false;
  }
};

export const directUpdate = async (itemId, options) => {
  try {
    const item = await itemModel.findById(itemId);
    if (!item) {
      throw new Error(`Item not found — ${itemName}.`)
    }

    if(options.steamCurrentPrice) {
      const steamPrice = await getCurrentPrice(item.itemName);
      if(!steamPrice) {
        throw new Error(`Cant get current price, item was not updated — ${item.itemName}.`)
      };

      item.price.steam = parseInt(steamPrice.lowest_price)
    };

    // Dota2 Market
    if(options.d2marketCurrentPrice) {
      const data = await d2marketGetCurrentPrice(item.itemName);
      if(!data.length) {
        throw new Error(`Request from Dota2Market is empty — ${item.itemName}. ${data}`)
      }
      if(!data[0].price) throw new Error(`Not found price in d2market res - ${data[0]}`)
      item.price.d2market = parseInt(data[0].price.toString().replace(/(\d{2})$/, ",$1"))
    };

    if(options.steamGeneralData) {
      const dataByDays = await getSteamHistoryByDays(item.itemName);
      if(!dataByDays) {
        throw new Error(`Cant get price history, item was not updated — ${item.itemName}.`)
      }
  
      const dataByWeeks = sortSteamHistoryByWeeks(dataByDays);
  
      const maxWeeks = Math.min(150, dataByWeeks.length);
      const maxWeeksYear = Math.min(52, dataByWeeks.length);
  
      const dataByWeeksAlltime = dataByWeeks.slice(0, maxWeeks);
      const dataByWeeksYear = dataByWeeks.slice(0, maxWeeksYear);
  
      item.steamData.byWeeksData = dataByWeeksAlltime,
      item.steamData.monthData = dataByDays.slice(1, 31),
      item.steamData.minPriceYear = dataByWeeksYear.reduce((acc, value) => Math.min(acc, value[1]), 99999),
      item.steamData.maxPriceYear = dataByWeeksYear.reduce((acc, value) => Math.max(acc, value[1]), 0),
      item.steamData.minPriceAlltime = dataByWeeksAlltime.reduce((acc, value) => Math.min(acc, value[1]), 99999),
      item.steamData.maxPriceAlltime = dataByWeeksAlltime.reduce((acc, value) => Math.max(acc, value[1]), 0),
      item.steamData.averagePriceYear = Math.round(dataByWeeksYear.reduce((acc, value) => acc + value[1], 0) / maxWeeksYear),
      item.steamData.averagePriceAlltime = Math.round(dataByWeeksAlltime.reduce((acc, value) => acc + value[1] ,0) / maxWeeks),
      item.steamData.averageSalesYear = Math.round(dataByWeeksYear.reduce((acc, value) => acc + value[2], 0) / maxWeeksYear),
      item.steamData.averageSalesAlltime = Math.round(dataByWeeksAlltime.slice(0, maxWeeks).reduce((acc, value) => acc + value[2] ,0) / maxWeeks),
      item.steamData.updated = todayDate
    };

    await item.save();
    console.log(`Updated — ${item.itemName}`)
    return true;
  } catch (err) {
    logger.error("Update Item error:", err);
    return false;
  }
};

export async function directUpdateAll () {
  const itemsArr = await itemModel.find().exec();
  if (!itemsArr) {
    return res.status(404).json({ message: "Items not found" });
  }

  for(let i = 0; i < itemsArr.length; i++) {
    let currentItem = itemsArr[i];
    await directUpdate(currentItem._id, { steamCurrentPrice: true, d2marketCurrentPrice: true, steamGeneralData: true})
  }

  return console.log('All items was successfully updated!')
}