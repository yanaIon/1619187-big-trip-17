import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {TYPE} from '../const.js';
import {humanizeDateWithTime, getPointDuration} from '../util.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createTypeDropdown = (currentType, isDisabled) => `
<div class="event__type-wrapper">
<label class="event__type  event__type-btn" for="event-type-toggle-1">
  <span class="visually-hidden">Choose event type</span>
  <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
</label>
<input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

<div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>

    ${TYPE.map((type) => `
    <div class="event__type-item">
    <input ${type === currentType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''} id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1" data-event-type="${type}">${type}</label>
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
   <select value="${currentDestination.name}" ${isDisabled ? 'disabled' : ''}  class="event__input  event__input--destination" id="destination-list-1">
   ${destinationCity.map((city)=>
    `<option value="${city.name}" ${city.name === currentDestination.name ? 'selected':''}>${city.name}</option>`
  ).join('')}
   </select>
 </div>`;

const createDestination = (currentDestination) =>
  `<p class="event__destination-description">${currentDestination.description}</p>
  <div class="event__photos-container">
  <div class="event__photos-tape">
  ${currentDestination.pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
  ).join('')}
  </div>
</div>`;

const createEditPointTemplate = (point, offers, listDestinations) => {
  const {basePrice, dateFrom, dateTo, type, isDisabled, isSaving, isDeleting} = point;
  const destination = listDestinations.find((destinationItem) => destinationItem.name === point.destination);

  const dateStart = humanizeDateWithTime(dateFrom);
  const dateEnd = humanizeDateWithTime(dateTo);


  const getOffersList = function (offersList, currentPoint) {

    const currentOffers = offersList.find((offersGroup) => offersGroup.type === currentPoint.type);

    return currentOffers.offers.map((offer) => {

      const checked = currentPoint.offers.includes(offer.id) ? 'checked' : '';
      const offerTitleArray = offer.title.split(' ');
      const nameOfferForId = offerTitleArray[offerTitleArray.length-1];

      return `<div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" data-id="${offer.id}" ${isDisabled ? 'disabled' : ''} id="event-offer-${nameOfferForId}-1" type="checkbox" name="event-offer-luggage" ${checked}></input>
    <label class="event__offer-label" for="event-offer-${nameOfferForId}-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;}).join('');};

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${createTypeDropdown(type, isDisabled)}
        ${createFieldGroup(type, destination, listDestinations, isDisabled)}
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" ${isDisabled ? 'disabled' : ''} type="submit">${isSaving ? 'saving...' : 'save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'deleting...' : 'delete'}</button>
        <button class="event__rollup-btn" ${isDisabled ? 'disabled' : ''} type="button">
          <span class="visually-hidden">Open event</span>
        </button>
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

export default class EditPointView extends AbstractStatefulView{
  #datepicker = null;

  constructor(point, offers, listDestinations) {
    super();
    this.originPoint = point;
    this._state = EditPointView.parsePointToState(point);
    this.offers = offers;
    this.listDestinations = listDestinations;

    this.#setInnerHandlers();
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  get template() {
    return createEditPointTemplate(this._state, this.offers, this.listDestinations);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    if (getPointDuration({...this._state, dateTo: userDate, }).asSeconds() < 0) {
      this.updateElement({
        dateFrom: this._state.dateTo,
      });
    } else {
      this.updateElement({
        dateFrom: userDate,
      });
    }
  };

  #dateToChangeHandler = ([userDate]) => {
    if (getPointDuration({...this._state, dateTo: userDate, }).asSeconds() < 0) {
      this.updateElement({
        dateTo: this._state.dateFrom,
      });
    } else {
      this.updateElement({
        dateTo: userDate,
      });
    }
  };

  #setDatepickerFrom = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
  };

  #setDatepickerTo = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
      },
    );
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseEditFormClickHandler(this._callback.closeEditFormClick);
    this.setPointDeleteHandler(this._callback.pointDeleteClick);
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
    this._callback.formSubmit = () => callback(EditPointView.parseStateToPoint(this._state));
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };


  #formSubmitHandler = (event) => {
    event.preventDefault();
    this._callback.formSubmit();
  };


  #setPrice = (event) => {
    if( Number(event.target.value) >0) {
      this._setState({
        basePrice: Number(event.target.value),
      });
    } else {
      this.updateElement({
        basePrice: 1,
      });
    }
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('click', this.#selectTypeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#selectCityHandler);

    this.element.querySelector('#event-price-1').addEventListener('input', this.#setPrice);

    this.element.querySelector('.event__available-offers').addEventListener('click', this.#setOffer);

  };

  reset = () => {
    this.updateElement(
      this.originPoint,
    );
  };

  setCloseEditFormClickHandler = (callback) => {
    this._callback.closeEditFormClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeEditFormClickHandler);
  };

  #closeEditFormClickHandler = () => {
    this._callback.closeEditFormClick();
  };


  setPointDeleteHandler = (callback) => {
    this._callback.pointDeleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#pointDeletekHandler);
  };

  #pointDeletekHandler = () => {
    this._callback.pointDeleteClick();
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
