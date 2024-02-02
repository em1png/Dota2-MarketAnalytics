import Axios from "axios-https-proxy-fix";
import { proxies } from "../config/proxies.js"

export const makeRequestWithProxies = async ({ url, options, api = "other", proxyArr, index = 0 }) => {
  let shouldRetry = false;
  let currentProxies = null;
  
  // Create proxy list and select proxy
  if(!proxyArr) {
    currentProxies = [...proxies].sort((a, b) => a[api][0] - b[api][0])
  } else {
    currentProxies = proxyArr;
  };

  if(!currentProxies.length) {
    throw new Error('Proxy list is empty')
  };

  const currentProxy = currentProxies[index];
  
  if(!currentProxy) {
    throw new Error('Proxy not found')
  };

  // Make request
  try {
    console.log(`- - - - - - - - - - [FETCH] ${currentProxy.body.host || 'local'} || ${url}`);
    proxies[currentProxy._id][api][0]++;

    const response = await Axios.get(url, {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ...(options ? options : { timeout: 7000 }),
      ...(currentProxy.body.host && { proxy: currentProxy.body }),
    });

    if (response.status === 200) {
      proxies[currentProxy._id][api][1]++;
      return response.data;
    }
    else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  }
  catch (error) {
    console.log(`(catch) error makeRequestWithProxies ${currentProxy.host || 'local'} | ${error.message}`)
    proxies[currentProxy._id][api][2]++;
    index++;

    if(index % currentProxies.length) {
      shouldRetry = true;
    }
    else return false;
  } 
  finally {
    if(shouldRetry) {
      return await makeRequestWithProxies({ url, options, api, proxyArr: currentProxies, index });
    }
  }
};