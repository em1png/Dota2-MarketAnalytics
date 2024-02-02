export const proxies = [
  {
    // local, w/o proxy
  },

  // Your proxy list here
  {
    protocol: "https",
    host: "123.123.123.123",
    port: 1111,
    auth: { username: "user", password: "pass" },
  },
].reduce((acc, value, index) => {
  acc.push({
    body: {
      ...value,
    },
    d2marketSearchItemByHashName: [0, 0, 0],
    steamPriceHistory: [0, 0, 0],
    steamPriceOverview: [0, 0, 0],
    other: [0, 0, 0],
    _id: index,
  });

  return acc;
}, []);
