import { TYPE } from '../const.js';

export const generateOffer = () => ({
  type: 'taxi',
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


export const offers = TYPE.map((type, i) => ({
  type,
  offers: [
    {
      id: 1 * i,
      title: 'Upgrade to a business class',
      price: 120
    }, {
      id: 2 * i + TYPE.length,
      title: 'Choose the radio station',
      price: 60
    },
  ]
}));

