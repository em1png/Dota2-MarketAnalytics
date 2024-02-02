export const todayDate = new Date();
export const todayDay = todayDate.getDate();
export const todayMonth = todayDate.getMonth() + 1;
export const todayYear = todayDate.getFullYear();

export const JWT_SECRET = process.env.JWT_SECRET || "writeYourTokenHere";