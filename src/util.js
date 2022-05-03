import dayjs from 'dayjs';

const humanizeDate = (date) => dayjs(date).format('HH:hh');
const humanizeDate2 = (date) => dayjs(date).format('DD/MM/YYYY HH:hh');
const humanizeDate3 = (date) => dayjs(date).format('MMM D');

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
export {humanizeDate, humanizeDate2, humanizeDate3, getRandomInteger};
