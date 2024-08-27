import Axios from "axios-https-proxy-fix";
import { ProxyList } from "./constants.js";

export const makeRequestThrowProxy = async (url) => {
    // Первый запрос без прокси
    const res = await Axios.get(url, {
        headers: { cookie: process.env.STEAM_COOKIE },
        timeout: 5000,
    });

    if (res.status === 200) {
        return res.data
    }

    // С прокси
    const regexp = /https:\/\/steamcommunity\.com\/market\/([a-zA-Z]+)/;
    const match = url.match(regexp);

    if (!match) {
        throw ("Invalid URL");
    }

    // Сортируем прокси по значению search
    const newProxyList = ProxyList.sort((a, b) => b[match] || Infinity - a[match] || Infinity);

    let result = null;

    for (let i = 0; i < newProxyList.length; i++) {
        try {
            const { proxy } = newProxyList[i];
            newProxyList[i].search++;
            console.log(`[!] Request: ${proxy[0]}:${proxy[1]}`)

            // Делаем запрос
            const res = await Axios.get(url, {
                headers: { cookie: process.env.STEAM_COOKIE },
                proxy: {
                    host: proxy[0],
                    port: proxy[1],
                },
                timeout: 5000,
            });

            if (res.status === 200) {
                result = res.data;
                console.log(`[+] Proxy: ${proxy[0]} | ${proxy[1]}`)
                break;
            }
        } catch (error) {
            console.error(`[-] Proxy error: ${error.message}`);
            if (i == newProxyList.length - 1) throw ("[-] No proxies available")
        }
    }
    return result;
};