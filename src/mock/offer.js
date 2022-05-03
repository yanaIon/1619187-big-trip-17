import {getRandomType} from './point.js';

export const generateOffer = () => ({
  type: getRandomType(),
  offers: [
    {
      id: 1,
      title: 'Upgrade to a business class',
      price: 120
    }, {
      id: 2,
      title: 'Choose the radio station',
      price: 60
    }
  ]
});
