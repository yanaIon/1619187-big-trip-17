import {nanoid} from 'nanoid';

export const generatePoint = () => ({
  id: nanoid(),
  basePrice: 300,
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  isFavorite: false,
  destination: 'Chamonix',
  offers: [9],
  type: 'taxi',
});

export const generatePoint2 = () => ({
  id: nanoid(),
  basePrice: 222,
  dateFrom: '2019-07-01T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  isFavorite: false,
  destination: 'Chamonix',
  offers: [9],
  type: 'flight',
});
