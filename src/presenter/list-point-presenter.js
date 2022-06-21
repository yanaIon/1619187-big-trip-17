import {remove, render, RenderPosition} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import NewPointEditorView from '../view/new-point-editor-view.js';
import ListPointView from '../view/list-point-view.js';
import NoPointView from '../view/no-point-view.js';
import TripInfoView from '../view/trip-info-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import {sortPointsByDuration, sortPointsByPrice, filter, sortPointsByDay} from '../util.js';
import {UserAction, UpdateType, SortType} from '../const.js';
import LoadingView from '../view/loading-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class ListPointPresenter {
  #listContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #isLoading = true;
  #closeNewPointForm = () => {
    document.querySelector('.trip-main__event-add-btn').disabled=false;
    remove(this.#newPointEditorView);
  };

  #loadingComponent = new LoadingView();
  #listComponent = new ListPointView();
  #noPointComponent = null;
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #newPointEditorView = null;
  #infoView = null;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  #listOffers = [];
  #listDestinations = [];

  #pointPresenters = new Map();

  constructor (listContainer, pointsModel, filterModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const points = filter[this.#filterModel.filter](this.#pointsModel.points);
    switch (this.#currentSortType) {
      case SortType.PRICE:
        return [...points].sort(sortPointsByPrice);
      case SortType.TIME:
        return [...points].sort(sortPointsByDuration);
    }

    return [...points].sort(sortPointsByDay);
  }


  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointPresenters.get(update.id)?.setSaving();
        try {
          await  this.#pointsModel.updatePoint(updateType, update);
        } catch (error) {
          this.#pointPresenters.get(update.id)?.setAborting();
        }
        break;
      case UserAction.ADD_TASK:
        this.#newPointEditorView.updateElement({
          isDisabled: true,
          isSaving: true,
        });
        try {
          await  this.#pointsModel.addPoint(updateType, update);
        } catch (error) {
          const resetFormState = () => {
            this.#newPointEditorView.updateElement({
              isDisabled: false,
              isSaving: false,
            });
          };

          this.#newPointEditorView.shake(resetFormState);
        }
        break;
      case UserAction.DELETE_TASK:
        this.#pointPresenters.get(update.id)?.setDeleting(updateType, update);
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (error) {
          this.#pointPresenters.get(update.id)?.setAborting();

        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data, this.#listOffers, this.#listDestinations);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#listOffers = this.#pointsModel.offer;
        this.#listDestinations = this.#pointsModel.destinatinations;

        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  init = () => {
    this.#listOffers = [...this.#pointsModel.offer];
    this.#listDestinations = [...this.#pointsModel.destinatinations];

    this.#renderBoard();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderListPoint = () => {
    const points = this.points;

    for (const point of points) {
      this.#renderPoint(point);
    }
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#listComponent.element, this.#handleViewAction ,this.#handleModeChange, this.#closeNewPointForm);
    pointPresenter.init(point, this.#listOffers, this.#listDestinations);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#listComponent.element, RenderPosition.AFTERBEGIN);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort = () => {
    if(this.#sortComponent) {
      this.#sortComponent.dispose();
      remove(this.#sortComponent);
    }
    const sortView = new SortView(this.#currentSortType);
    this.#sortComponent = sortView;
    render(sortView, this.#listComponent.element, RenderPosition.AFTERBEGIN);
    sortView.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderNoPoints = (text) => {
    this.#noPointComponent = new NoPointView(text);
    render(this.#noPointComponent, this.#listComponent.element, RenderPosition.AFTERBEGIN);
  };

  #clearBoard = ({ resetSortType = false} = {}) => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#infoView);


    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if(this.#newPointEditorView) {
      remove(this.#newPointEditorView);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderBoard = () => {
    render(this.#listComponent, this.#listContainer);


    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const currentFilter = this.#filterModel.filter;
    const text = this.#filterModel.noPointTextByFilter[currentFilter];

    if (points.length === 0) {
      this.#renderNoPoints(text);
      return;
    }

    const tripMain = document.querySelector('.trip-main');
    this.#infoView = new TripInfoView();

    render(this.#infoView, tripMain, 'afterbegin');
    this.#renderSort();


    this.#renderListPoint();

  };

  createPoint = (cb) => {

    const closeNewPointForm = () => {

      remove(this.#newPointEditorView);
      this.#newPointEditorView = null;
      cb();
    };

    this.#pointPresenters.forEach((presenter) => presenter.resetView());

    this.#newPointEditorView = new NewPointEditorView(this.#listOffers, this.#listDestinations);


    this.#newPointEditorView.setFormSubmitHandler((update) => {
      this.#handleViewAction(UserAction.ADD_TASK, UpdateType.MINOR, update);
      cb();
    });

    this.#newPointEditorView.setFormCloseHandler(closeNewPointForm);

    render(this.#newPointEditorView, this.#listComponent.element, RenderPosition.AFTERBEGIN);
  };

  destroy(){
    remove(this.#loadingComponent);
    this.#clearBoard();
  }
}
