import AbstractView from '../framework/view/abstract-view.js';

const createNewTaskButtonTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow">New event</button>';

export default class NewPointButtonView extends AbstractView {
  get template() {
    return createNewTaskButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (event) => {
    event.preventDefault();
    this._callback.click();
  };
}
