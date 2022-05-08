import {createElement} from '../render.js';

const createListPointTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class ListPointView {
  #element = null;

  get template() {
    return createListPointTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
