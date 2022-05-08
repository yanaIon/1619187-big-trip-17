import {createElement} from '../render.js';
import {TYPE} from '../const.js';
import {CITY} from '../const.js';
import {humanizeDateWithTime} from '../util.js';


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
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>
  `).join('')}
  </fieldset>
</div>
</div>
`;

const createFieldGroup = (type, currentDestination, destinationCity) =>
  `<div class="event__field-group  event__field-group--destination">
   <label class="event__label  event__type-output" for="event-destination-1">
     ${type}
   </label>
   <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-1">
   <datalist id="destination-list-1">
   ${destinationCity.map((city)=>
    `<option value="${city}"></option>`
  ).join('')}
   </datalist>
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

const createEditPointTemplate = (point, offers, destination) => {
  const {basePrice, dateFrom, dateTo, type} = point;

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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
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

export default class EditPointView {
  constructor(point, offers, destination) {
    this.point = point;
    this.offers = offers;
    this.destination = destination;
  }

  #element = null;

  get template() {
    return createEditPointTemplate(this.point, this.offers, this.destination);
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