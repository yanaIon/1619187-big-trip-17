import {render} from '../render.js';
import NewPointView from '../view/add-new-point-view.js';
import PointView from '../view/point-view.js';
import ListPointView from '../view/list-point-view.js';
import EditPointView from '../view/edit-point-view.js';


export default class ListPointPresenter {
  listComponent = new ListPointView();


  init = (listContainer, pointsModel) => {
    this.listContainer = listContainer;
    this.pointsModel = pointsModel;
    this.listPoints = [...this.pointsModel.getPoints()];
    this.listOffers = [...this.pointsModel.getOffers()];
    this.listDestinations = [...this.pointsModel.getDestinatinations()];

    render(this.listComponent, this.listContainer); // ul, куда будут отрисованы li
    render(new NewPointView(), this.listComponent.getElement(), 'beforebegin'); //создание новой точки

    for (let i = 0; i < this.listPoints.length; i++) {
      const offers = this.listPoints[i].offers.map((offerId) => {
        let result;

        this.listOffers.forEach((offersGroup) => {
          offersGroup.offers.forEach((offer) => {
            if(offer.id === offerId) {
              result = offer;
            }
          });
        });

        return result;
      }
      );
      const destination = this.listDestinations.find((destinationItem) => destinationItem.name === this.listPoints[i].destination);

      render(new PointView(this.listPoints[i], offers), this.listComponent.getElement()); //перечисление точек маршрута
      render(new EditPointView(this.listPoints[i], offers, destination), this.listComponent.getElement()); //редактирование точки
    }
  };
}
