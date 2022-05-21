import {generatePoint, generatePoint2} from '../mock/point.js';
import {offers} from '../mock/offer.js';
import {generateDestination} from '../mock/destination.js';

export default class PointsModel {
  #points = [...Array.from({length: 5}, generatePoint), ...Array.from({length: 5}, generatePoint2)];
  #offers = offers;
  #destinations = Array.from({length: 1}, generateDestination);

  updatePoint(updatedPoint) {
    this.#points = this.#points.map((point) => {
      if (updatedPoint.id === point.id) {
        return updatedPoint;
      } else {
        return point;
      }
    });
  }

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
