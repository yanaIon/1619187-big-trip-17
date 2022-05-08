import {generatePoint} from '../mock/point.js';
import {offers} from '../mock/offer.js';
import {generateDestination} from '../mock/destination.js';

export default class PointsModel {
  #points = Array.from({length: 3}, generatePoint);
  #offers = offers;
  #destinations = Array.from({length: 1}, generateDestination);

  get points() {
    return this.#points;
  }

  get offer() {
    return this.#offers;
  }

  get destinatinations() {
    return this.#destinations;
  }
}
