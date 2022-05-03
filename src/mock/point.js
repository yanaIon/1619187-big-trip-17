import {TYPE} from '../const.js';
import {getRandomInteger} from '../util.js';

const getRandomType = () => {
  const randomIndex = getRandomInteger(0, TYPE.length - 1);

  return TYPE[randomIndex];
};

export const generatePoint = () => ({
  basePrice: 222,
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  isFavorite: false,
  destination: 'Chamonix',
  offers: [1, 2],
  type: getRandomType(),
});

export {getRandomType};
