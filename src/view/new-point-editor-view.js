import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {TYPE} from '../const.js';
import {CITY} from '../const.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const DEFAULT_STATE = {
  basePrice: null,
  dateFrom: new Date(),
  dateTo: new Date(),
  isFavorite: false,
  destination: 'Chamonix',
  offers: [],
  type: 'taxi',
};


const createTypeDropdown = (currentType, isDisabled) => `
<div class="event__type-wrapper">
<label class="event__type  event__type-btn" for="event-type-toggle-0">
  <span class="visually-hidden">Choose event type</span>
  <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
</label>
<input class="event__type-toggle  visually-hidden" id="event-type-toggle-0" type="checkbox" ${isDisabled ? 'disabled' : ''}>

<div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>

    ${TYPE.map((type) => `
    <div class="event__type-item">
    <input ${type === currentType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''} id="event-type-${type}-0" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-0" data-event-type="${type}">${type}</label>
  </div>
  `).join('')}
  </fieldset>
</div>
</div>
`;

const createFieldGroup = (type, currentDestination, destinationCity, isDisabled) => `<div class="event__field-group  event__field-group--destination">
<label class="event__label  event__type-output" for="event-destination-1">
${type}
</label>
<select value="${currentDestination?.name}" ${isDisabled ? 'disabled' : ''}  class="event__input  event__input--destination" id="destination-list-1">
${destinationCity.map((city)=>
    `<option value="${city}" ${city === currentDestination?.name ? 'selected':''}>${city}</option>`
  ).join('')}
</select>
</div>`;

const createDestination = (currentDestination) =>
  `<p class="event__destination-description">${currentDestination?.description}</p>
  <div class="event__photos-container">
  <div class="event__photos-tape">
  ${currentDestination?.pictures.map((picture) =>
    `<img class="event__photo" src="${picture?.src}" alt="${picture?.description}">`
  ).join('')}
  </div>
</div>`;

const createPointTemplate = (point, offers, listDestinations) => {
  const {basePrice, dateFrom, dateTo, type, isDisabled, isSaving} = point;
  const destination = listDestinations.find((destinationItem) => destinationItem.name === point.destination);
  const dateStart = dateFrom;
  const dateEnd = dateTo;


  const getOffersList = function (offersList, currentPoint) {

    const currentOffers = offersList.find((offersGroup) => offersGroup.type === currentPoint.type);
    return currentOffers?.offers.map((offer) => {

      const checked = currentPoint.offers.includes(offer.id) ? 'checked' : '';
      const offerTitleArray = offer.title.split(' ');
      const nameOfferForId = offerTitleArray[offerTitleArray.length-1];

      return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" ${isDisabled ? 'disabled' : ''} data-id="${offer.id}" id="event-offer-${nameOfferForId}-0" type="checkbox" name="event-offer-luggage" ${checked}></input>
    <label class="event__offer-label" for="event-offer-${nameOfferForId}-0">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;}).join('');
  };

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${createTypeDropdown(type, isDisabled)}
        ${createFieldGroup(type, destination, CITY, isDisabled)}
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-0">From</label>
          <input class="event__input  event__input--time" id="event-start-time-0" type="text" name="event-start-time" value="${dateStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-0">To</label>
          <input class="event__input  event__input--time" id="event-end-time-0" type="text" name="event-end-time" value="${dateEnd}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-0">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-0" type="number" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'saving...' : 'save'}</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${getOffersList(offers, point)}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          ${createDestination(destination)}
        </section>
      </section>
    </form>
    </li>`
  );
};

export default class NewPointEditorView extends AbstractStatefulView{
  #datepicker = null;

  constructor(offers, listDestinations) {
    super();
    this._state = NewPointEditorView.parsePointToState({...DEFAULT_STATE});

    this.offers = offers;
    this.listDestinations = listDestinations;

    this.#setInnerHandlers();
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  get template() {
    return createPointTemplate(this._state, this.offers, this.listDestinations);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });

  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepickerFrom = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-start-time-0'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        onChange: this.#dateFromChangeHandler,
      },
    );
  };

  #setDatepickerTo = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-end-time-0'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        onChange: this.#dateToChangeHandler,
      },
    );
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
    this.setFormSubmitHandler(this._callback.formSubmit);
  };

  #selectTypeHandler = (event) => {
    event.preventDefault();
    this.updateElement({
      type: event.target.dataset.eventType,
    });
  };

  #selectCityHandler = (event) => {
    event.preventDefault();
    this.updateElement({
      destination: event.target.value,
    });
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = () => callback(NewPointEditorView.parseStateToPoint(this._state));
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setFormOpenHandler = (callback) => {
    this._callback.formOpen = callback;

    document.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#formOpenHandler);
  };

  #formOpenHandler = (event) => {
    event.preventDefault();
    if (typeof this._callback.formOpen === 'function') {
      this._callback.formOpen();
    }
  };

  setFormCloseHandler = (callback) => {
    this._callback.formClose = callback;

    document.addEventListener('keydown', this.#formCloseHandler);
  };

  #formCloseHandler = (event) => {
    if (typeof this._callback.formClose === 'function' && (event.key === 'Escape' || event.key === 'Esc')) {
      this._callback.formClose();
    }
  };

  #formSubmitHandler = (event) => {
    event.preventDefault();
    this._callback.formSubmit();
  };


  #setPrice = (event) => {
    this._setState({
      basePrice: Number(event.target.value),
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('click', this.#selectTypeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#selectCityHandler);

    this.element.querySelector('#event-price-0').addEventListener('change', this.#setPrice);

    this.element.querySelector('.event__available-offers').addEventListener('click', this.#setOffer);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#setCancel);

  };

  reset = () => {
    this.updateElement(
      DEFAULT_STATE,
    );
  };

  #setOffer = (event) => {
    const id = Number(event.target.dataset.id);

    if(!isNaN(id)) {
      const offers = this._state.offers;

      if(offers.includes(id)) {
        this.updateElement({
          offers: offers.filter((elem) => elem !== id)
        });
      } else {
        this.updateElement({
          offers: [...offers, id]
        });
      }
    }
  };

  #setCancel = () => {
    this._callback.formClose();
    this.reset();
  };

  static parsePointToState = (point) => ({
    ...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => {
    const newState = {...state};
    delete newState.isDisabled;
    delete newState.isSaving;
    delete newState.isDeleting;

    return newState;
  };
}
