import {render} from '../render.js';
import NewPointView from '../view/add-new-point-view.js';
import PointView from '../view/point-view.js';
import ListPointView from '../view/list-point-view.js';
import EditPointView from '../view/edit-point-view.js';


export default class ListPointPresenter {
  #listContainer = null;
  #pointsModel = null;

  #listComponent = new ListPointView();

  #listPoints = [];
  #listOffers = [];
  #listDestinations = [];

  init = (listContainer, pointsModel) => {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#listPoints = [...this.#pointsModel.points];
    this.#listOffers = [...this.#pointsModel.offer];
    this.#listDestinations = [...this.#pointsModel.destinatinations];

    render(this.#listComponent, this.#listContainer); // ul, куда будут отрисованы li
    render(new NewPointView(), this.#listComponent.element, 'beforebegin'); //создание новой точки

    for (let i = 0; i < this.#listPoints.length; i++) {
      const offers = this.#listPoints[i].offers.map((offerId) => {
        let result;

        this.#listOffers.forEach((offersGroup) => {
          offersGroup.offers.forEach((offer) => {
            if(offer.id === offerId) {
              result = offer;
            }
          });
        });

        return result;
      }
      );
      const destination = this.#listDestinations.find((destinationItem) => destinationItem.name === this.#listPoints[i].destination);

      this.#renderPoint(this.#listPoints[i], offers, destination); //перечисление точек маршрута
      //render(new EditPointView(this.#listPoints[i], this.#listOffers, destination), this.#listComponent.element); //редактирование точки
    }
  };

  #renderPoint = (point,offer,destination) => {
    const pointComponent = new PointView(point,offer);
    const editPointComponent = new EditPointView(point, this.#listOffers, destination);

    const replacePointToForm = () => {
      this.#listComponent.element.replaceChild(editPointComponent.element, pointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#listComponent.element.replaceChild(pointComponent.element, editPointComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#listComponent.element);
  };
}