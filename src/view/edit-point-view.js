import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {TYPE} from '../const.js';
import {CITY} from '../const.js';
import {humanizeDateWithTime} from '../util.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createTypeDropdown = (currentType) => `
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
    <input ${type === currentType ? 'checked' : ''} id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1" data-event-type="${type}">${type}</label>
  </div>
  `).join('')}
  </fieldset>
</div>
</div>
`;

{/* <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-1"> */}

const createFieldGroup = (type, currentDestination, destinationCity) => `<div class="event__field-group  event__field-group--destination">
   <label class="event__label  event__type-output" for="event-destination-1">
     ${type}
   </label>
   <select value="${currentDestination.name}"  class="event__input  event__input--destination" id="destination-list-1">
   ${destinationCity.map((city)=>
    `<option value="${city}" ${city === currentDestination.name ? 'selected':''}>${city}</option>`
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
  const {basePrice, dateFrom, dateTo, type} = point;
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
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${nameOfferForId}-1" type="checkbox" name="event-offer-luggage" ${checked}></input>
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
        ${createTypeDropdown(type)}
        ${createFieldGroup(type, destination, CITY)}
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

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
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
    this._state = point;
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

  #selectTypeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.dataset.eventType,
    });
  };

  #selectCityHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: evt.target.value,
    });
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = () => callback(this._state);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  };


  #setPrice = (evt) => {
    // this.updateElement({
    //   basePrice: Number(evt.target.value),
    // });

    // const input = this.element.querySelector('#event-price-1');
    // input.setAttribute('type', 'text');
    // const end = input.value.length;
    // input.setSelectionRange(end, end);
    // input.focus();
    // input.setAttribute('type', 'number');
  };


  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('click', this.#selectTypeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#selectCityHandler);

    this.element.querySelector('#event-price-1').addEventListener('input', this.#setPrice);

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
}
