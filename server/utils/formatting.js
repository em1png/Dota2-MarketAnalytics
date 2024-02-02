export const getStringSteamDate = (dateStr) => {
  const result = {};

  function getMonthIndex(monthStr) {
    switch (monthStr) {
      case "Jan":
        return 1;
      case "Feb":
        return 2;
      case "Mar":
        return 3;
      case "Apr":
        return 4;
      case "May":
        return 5;
      case "Jun":
        return 6;
      case "Jul":
        return 7;
      case "Aug":
        return 8;
      case "Sep":
        return 9;
      case "Oct":
        return 10;
      case "Nov":
        return 11;
      case "Dec":
        return 12;
    }
  }

  result.year = dateStr.substr(7, 4);
  result.day = dateStr.substr(4, 2);
  result.month = getMonthIndex(dateStr.substr(0, 3));

  return result;
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
