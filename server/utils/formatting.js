export const getStringSteamDate = (dateStr) => {
  const months = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
  };

  return {
    year: dateStr.slice(7, 11),
    month: months[dateStr.slice(0, 3)],
    day: dateStr.slice(4, 6)
  };
};

export const sortSteamHistoryByWeeks = (dataByDay) => {
  if (!dataByDay) return false;
  const result = [];

  for (let i = 0, j = 0; i < dataByDay.length; i++) {
    if (j === 0) {
      result.push([
        dataByDay[i][0],
        parseInt(dataByDay[i][1]),
        parseInt(dataByDay[i][2]),
      ]);
    } else {
      const [_, prevPrice, prevQuantity] = result[result.length - 1];

      result[result.length - 1] = [
        dataByDay[i][0],
        prevPrice + parseInt(dataByDay[i][1]),
        prevQuantity + parseInt(dataByDay[i][2]),
      ];

      if (j === 6) {
        j = 0;
        continue;
      }
    }
    j++;
  }

  result.forEach(
    ([date, price, quantity], index) =>
      (result[index] = [date, Math.round(price / 7), Math.round(quantity / 7)])
  );
  return result;
};
