import AbstractView from '../framework/view/abstract-view.js';

const createListPointTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class ListPointView extends AbstractView{
  get template() {
    return createListPointTemplate();
  }
}
