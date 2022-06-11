import AbstractView from '../framework/view/abstract-view.js';

const createNoPointTemplate = (text) => (
  `<p class="trip-events__msg">${text}</p>`
);

export default class NoPointView extends AbstractView {
  #text = null;

  constructor(text) {
    super();
    this.#text = text;
  }

  get template() {
    return createNoPointTemplate(this.#text);
  }
}
