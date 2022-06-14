import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class PointsModel extends Observable {
  #points = [];
  #offers = [];
  #destinations = [];
  #pointsApiService = null;

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;

  }

  init = async () => {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptPointToClient);
    } catch(err) {
      this.#points = [];
    }

    try {
      this.#offers = await this.#pointsApiService.offers;
    } catch(err) {
      this.#offers = [];
    }

    try {
      this.#destinations = await this.#pointsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  };

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(this.#adaptPointToServer(update));
      const updatedPoint = this.#adaptPointToClient(response);
      this.#points = this.#points.map((point) => {
        if (update.id === point.id) {
          return updatedPoint;
        } else {
          return point;
        }
      });
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
  };

  addPoint = async (updateType, update) => {
    try {
      const response = await this.#pointsApiService.addPoint(this.#adaptPointToServer(update));
      const newPoint = this.#adaptPointToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add task');
    }
  };

  deletePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete task');
    }
  };

  get points() {
    return this.#points;
  }

  get offer() {
    return this.#offers;
  }

  get destinatinations() {
    return this.#destinations;
  }

  #adaptPointToClient(point) {
    const result = {
      ...point,
      basePrice: point.base_price,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      destination: point.destination.name,
      isFavorite: point.is_favorite
    };

    delete result.base_price;
    delete result.date_from;
    delete result.date_to;
    delete result.is_favorite;

    return result;
  }

  #adaptPointToServer(point) {
    const result = {
      ...point,
      ['base_price']: point.basePrice,
      ['date_from']: point.dateFrom,
      ['date_to']: point.dateTo,
      destination: this.#destinations.find((destination) => destination.name === point.destination),
      ['is_favorite']: point.isFavorite
    };

    delete result.basePrice;
    delete result.dateFrom;
    delete result.dateTo;
    delete result.isFavorite;

    return result;
  }
}
