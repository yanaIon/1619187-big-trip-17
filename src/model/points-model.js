import {generatePoint} from '../mock/point.js';
import {offers} from '../mock/offer.js';
import {generateDestination} from '../mock/destination.js';

export default class PointsModel {
  points = Array.from({length: 3}, generatePoint);
  offers = offers;
  destinations = Array.from({length: 1}, generateDestination);

  getPoints = () => this.points;
  getOffers = () => this.offers;
  getDestinatinations = () => this.destinations;
}
