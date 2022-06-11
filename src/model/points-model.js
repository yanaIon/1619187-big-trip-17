import {generatePoint, generatePoint2} from '../mock/point.js';
import {offers} from '../mock/offer.js';
import {generateDestination, generateDestination2, generateDestination3} from '../mock/destination.js';
import Observable from '../framework/observable.js';
export default class PointsModel extends Observable {
  #points = [...Array.from({length: 5}, generatePoint), ...Array.from({length: 5}, generatePoint2)];
  #offers = offers;
  #destinations = [...Array.from({length: 1}, generateDestination), ...Array.from({length: 1}, generateDestination2), ...Array.from({length: 1}, generateDestination3)];

  updatePoint(updateType, update) {
    this.#points = this.#points.map((point) => {
      if (update.id === point.id) {
        return update;
      } else {
        return point;
      }
    });
    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points.push(update);
    this._notify(updateType, update);

    return this.#points;
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
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
