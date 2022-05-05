import dayjs from 'dayjs';

const humanizeTime = (date) => dayjs(date).format('HH:hh');
const humanizeDateWithTime = (date) => dayjs(date).format('DD/MM/YYYY HH:hh');
const humanizeDateMonthAndDay= (date) => dayjs(date).format('MMM D');
const humanizeDateWIithoutTime = (date) => dayjs(date).format('YYYY-MM-DD');

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
export {humanizeTime, humanizeDateWithTime, humanizeDateMonthAndDay, humanizeDateWIithoutTime, getRandomInteger};
