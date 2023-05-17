const BASE_URL: string = process.env.REACT_APP_BASE_URL as string /* силлка в вишляді строки яка веде на апі  */
/* змінна для використання замість axios в коді */
const APP_ENV = {
    BASE_URL: BASE_URL
};
/* експорт */
export { APP_ENV }; 