import {remove, render} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {UserAction, UpdateType, FilterType} from '../const.js';
import {generateFilter} from '../util.js';

export default class ListPointPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor (filterContainer, filterModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  #handleViewAction = (actionType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILTER:
        this.#filterModel.updateFilter(UpdateType.MAJOR, update);
        break;
    }
  };

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.PATCH:
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.#clearFilters();
        this.#renderFilters();
        break;
    }
  };

  get filters() {
    return Object.keys(FilterType);
  }

  init = () => {
    this.#renderFilters();
  };

  #clearFilters = () => {
    remove(this.#filterComponent);
  };

  #renderFilters = () => {
    this.#filterComponent = new FilterView(generateFilter(this.#pointsModel.points), this.#filterModel.filter);

    this.#filterComponent.setClickHandler((evt) => {
      this.#handleViewAction(UserAction.UPDATE_FILTER, evt.target.htmlFor.split('__')[1]);
    });

    render(this.#filterComponent, this.#filterContainer);
  };
}
