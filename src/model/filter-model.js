import Observable from '../framework/observable.js';
import {FilterType} from '../const.js';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  updateFilter(updateType, update) {
    this.#filter = update;
    this._notify(updateType, update);
  }

  get filter() {
    return this.#filter;
  }

  get noPointTextByFilter() {
    return {
      [FilterType.EVERYTHING]: 'Click New Event to create your first point',
      [FilterType.PAST]: 'There are no past events now',
      [FilterType.FUTURE]: 'There are no future events now',
    };
  }
}
