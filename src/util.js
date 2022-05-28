import dayjs from 'dayjs';
import {FilterType} from './const.js';

const humanizeTime = (date) => dayjs(date).format('HH:hh');
const humanizeDateWithTime = (date) => dayjs(date).format('DD/MM/YYYY HH:mm');
const humanizeDateMonthAndDay= (date) => dayjs(date).format('MMM D');
const humanizeDateWIithoutTime = (date) => dayjs(date).format('YYYY-MM-DD');

const isPointPassed = (dateTo) => dateTo && dayjs().isAfter(dateTo, 'D'); // точки у которых дата окончания меньше, чем текущая.
const isPointFutured =(dateFrom) => dateFrom && dayjs().isBefore(dateFrom, 'D'); //дата начала события больше или равна текущей дате
const isPointInProgress = (dateFrom, dateTo) => dayjs().isAfter(dateFrom, 'D') && dayjs().isBefore(dateTo, 'D'); //отображаются во всех трёх списках

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isPointPassed(point.dateTo) || isPointInProgress(point.dateFrom, point.dateTo)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFutured(point.dateFrom) || isPointInProgress(point.dateFrom, point.dateTo))
};

const generateFilter = (points) => Object.entries(filter).map(
  ([filterName, filterPoints]) => ({
    name: filterName,
    count: filterPoints(points).length,
  }),
);

const getPointDuration = (point) => {
  const duration = dayjs.duration(dayjs(point.dateTo).diff(dayjs(point.dateFrom)));

  return duration;
};

const sortPointsByDuration = (pointA, pointB) => {
  const durationA = getPointDuration(pointA).asSeconds();
  const durationB = getPointDuration(pointB).asSeconds();

  if (durationA < durationB) {
    return 1;
  }
  if (durationA > durationB) {
    return -1;
  }
  return 0;
};

const sortPointsByPrice = (pointA, pointB) => {
  const priceA = pointA.basePrice;
  const priceB = pointB.basePrice;
  if (priceA < priceB) {
    return 1;
  }
  if (priceA > priceB) {
    return -1;
  }
  return 0;
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


export {humanizeTime, humanizeDateWithTime, humanizeDateMonthAndDay, humanizeDateWIithoutTime, getRandomInteger, generateFilter, sortPointsByDuration, sortPointsByPrice};
