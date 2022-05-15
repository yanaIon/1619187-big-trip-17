import {render, RenderPosition} from '../framework/render.js';
import NewPointView from '../view/add-new-point-view.js';
import ListPointView from '../view/list-point-view.js';
import NoPointView from '../view/no-point-view.js';
import InfoView from '../view/trip-info-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
export default class ListPointPresenter {
  #listContainer = null;
  #pointsModel = null;

  #listComponent = new ListPointView();
  #sortComponent = new SortView();
  #noPointComponent = new NoPointView();

  #listPoints = [];
  #listOffers = [];
  #listDestinations = [];

  #pointPresenter = new Map();

  constructor (listContainer, pointsModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#listPoints = [...this.#pointsModel.points];
    this.#listOffers = [...this.#pointsModel.offer];
    this.#listDestinations = [...this.#pointsModel.destinatinations];

    this.#renderListPoint();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderListPoint = () => {
    render(this.#listComponent, this.#listContainer);

    if (this.#listPoints.length === 0) {
      this.#renderNoPoints();
    } else {
      const tripMain = document.querySelector('.trip-main');
      render(new InfoView(), tripMain, 'afterbegin');
      this.#renderSort();
      render(new NewPointView(), this.#listComponent.element);

      for (let i = 0; i < this.#listPoints.length; i++) {
        this.#renderPoint(this.#listPoints[i]);
      }
    }
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #updatePointItem = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#listOffers,this.#listDestinations, this.#updatePointItem);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#listComponent.element, this.#handleModeChange);
    pointPresenter.init(point, this.#listOffers, this.#listDestinations, this.#updatePointItem);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#listComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderNoPoints = () => {
    render(this.#noPointComponent, this.#listComponent.element, RenderPosition.AFTERBEGIN);
  };
}
