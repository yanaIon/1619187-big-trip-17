import {render} from '../render.js';
import NewPointView from '../view/add-new-point-view.js';
import PointView from '../view/point-view.js';
import ListPointView from '../view/list-point-view.js';
import EditPointView from '../view/edit-point-view.js';


export default class ListPointPresenter {
  listComponent = new ListPointView();


  init = (listContainer) => {
    this.listContainer = listContainer;

    render(this.listComponent, this.listContainer); // ul, куда будут отрисованы li
    render(new NewPointView(), this.listComponent.getElement(), 'beforebegin'); //создание новой точки
    render(new EditPointView(), this.listComponent.getElement()); //редактирование точки

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.listComponent.getElement()); //перечисление точек маршрута
    }
  };
}
