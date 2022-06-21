import {remove, render} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {UserAction, UpdateType, FilterType} from '../const.js';
import {generateFilter} from '../util.js';

export default class FilterPresenter {
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

  #handleViewAction = (_, update) => {
    this.#filterModel.updateFilter(UpdateType.MAJOR, update);
  };

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
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

    this.#filterComponent.setClickHandler((filter) => {
      this.#handleViewAction(UserAction.UPDATE_FILTER, filter);
    });

    render(this.#filterComponent, this.#filterContainer);
  };
}
