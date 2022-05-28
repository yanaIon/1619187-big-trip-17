import {remove, render, RenderPosition} from '../framework/render.js';
import NewPointEditorView from '../view/new-point-editor-view.js';
import ListPointView from '../view/list-point-view.js';
import NoPointView from '../view/no-point-view.js';
import InfoView from '../view/trip-info-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import {sortPointsByDuration, sortPointsByPrice} from '../util.js';
import {SortType} from '../const.js';
export default class ListPointPresenter {
  #listContainer = null;
  #pointsModel = null;

  #listComponent = new ListPointView();
  #noPointComponent = new NoPointView();
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #newPointEditorView = null;

  #listPoints = [];
  #listOffers = [];
  #listDestinations = [];
  #soursedListPoints = [];

  #pointPresenters = new Map();

  constructor (listContainer, pointsModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#listPoints = [...this.#pointsModel.points];
    this.#listOffers = [...this.#pointsModel.offer];
    this.#listDestinations = [...this.#pointsModel.destinatinations];

    this.#soursedListPoints = [...this.#pointsModel.points];

    /** Форма добавления */
    this.#newPointEditorView = new NewPointEditorView(this.#listOffers, this.#listDestinations);

    this.#newPointEditorView.setFormSubmitHandler((newPoint) => {
      this.#addPointItem(newPoint);
      this.#newPointEditorView.reset();
      remove(this.#newPointEditorView);
      this.#newPointEditorView = null;
    });

    this.#newPointEditorView.setFormCloseHandler(() => {
      this.#newPointEditorView.reset();
      remove(this.#newPointEditorView);
      this.#newPointEditorView = null;
    });

    this.#newPointEditorView.setFormOpenHandler(() => {
      if(this.#newPointEditorView) {
        return;
      }
      this.#newPointEditorView = new NewPointEditorView(this.#listOffers, this.#listDestinations);
      this.#newPointEditorView.setFormSubmitHandler((newPoint) => {
        this.#addPointItem(newPoint);
        this.#newPointEditorView.reset();
        remove(this.#newPointEditorView);
        this.#newPointEditorView = null;
      });
      render(this.#newPointEditorView, this.#listComponent.element, RenderPosition.BEFOREBEGIN);
    });
    /** Форма добавления */

    this.#renderListContainer();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderListContainer = () => {
    render(this.#listComponent, this.#listContainer);

    if (this.#listPoints.length === 0) {
      this.#renderNoPoints();
    } else {
      const tripMain = document.querySelector('.trip-main');
      render(new InfoView(), tripMain, 'afterbegin');
      this.#renderSort();

      render(this.#newPointEditorView, this.#listComponent.element);

      this.#renderListPoint();
    }
  };

  #renderListPoint = () => {
    for (let i = 0; i < this.#listPoints.length; i++) {
      this.#renderPoint(this.#listPoints[i]);
    }
  };

  #clearPointList = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

  #updatePointItem = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, this.#listOffers, this.#listDestinations, this.#updatePointItem);
  };

  #addPointItem = (newPoint) => {
    const updatedList = this.#pointsModel.addPoint(newPoint);
    this.#listPoints = [...updatedList];
    this.#clearPointList();
    this.#renderListPoint();

  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#listComponent.element, this.#handleModeChange);
    pointPresenter.init(point, this.#listOffers, this.#listDestinations, this.#updatePointItem);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #sortPoints = (sortType) => {

    switch (sortType) {
      case SortType.PRICE:
        this.#listPoints.sort(sortPointsByPrice);
        break;
      case SortType.TIME:

        this.#listPoints.sort(sortPointsByDuration);
        break;
      default:
        this.#listPoints = [...this.#soursedListPoints];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#renderSort();
    this.#clearPointList();
    this.#renderListPoint();
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

  #renderNoPoints = () => {
    render(this.#noPointComponent, this.#listComponent.element, RenderPosition.AFTERBEGIN);
  };
}
