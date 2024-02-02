import { apiKeyD2Market } from "../config/authorization.js";
import { makeRequestWithProxies } from "../utils/utils.js";

let d2marketApiQueries = 0;
setInterval(() => d2marketApiQueries = 0, 1000);

export const d2marketGetCurrentPrice = async (itemName) => {
    try {
      if(d2marketApiQueries >= 5) await new Promise(resolve => setTimeout(resolve, 1100));
      const { data } = await makeRequestWithProxies({
        url: `https://market.dota2.net/api/v2/search-item-by-hash-name?key=${apiKeyD2Market}&hash_name=${itemName}`,
        api: "d2marketSearchItemByHashName",
      });

      d2marketApiQueries++
      if(!data.length) {
        throw new Error(`Data is empty. Data: ${data}`);
      }

      console.log(`d2marketGetCurrentPrice - ${itemName}. SUCCESS`)
      return data;
    } catch (error) {
      console.error(`[ERROR] getCurrentPrice: ${error}`);
      return false;
    }
  };