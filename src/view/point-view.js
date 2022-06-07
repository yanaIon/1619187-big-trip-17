import AbstractView from '../framework/view/abstract-view.js';
import {humanizeTime} from '../util.js';
import {humanizeDateMonthAndDay} from '../util.js';
import {humanizeDateWIithoutTime} from '../util.js';
import {humanizeDateWithTime} from '../util.js';
import dayjs from 'dayjs';

const getOffersList = function (offersList) {
  const result = offersList.map(({title, price}) => `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`).join('');
  return result;
};

const createPointTemplate = (point, offers) => {
  const {basePrice, dateFrom, dateTo, isFavorite, type, destination} = point;

  const dateStart = humanizeTime(dateFrom);
  const dateEnd = humanizeTime(dateTo);
  const datePoint = humanizeDateMonthAndDay(dateFrom);

  const  duration = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));

  const isFavourite = isFavorite ? 'event__favorite-btn--active' : '';

  return (
    `<li class="trip-events__item">
    <div class="event">
    <time class="event__date" datetime="${humanizeDateWIithoutTime(dateFrom)}">${datePoint}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destination}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${humanizeDateWithTime(dateFrom)}">${dateStart}</time>
        &mdash;
        <time class="event__end-time" datetime="${humanizeDateWithTime(dateTo)}">${dateEnd}</time>
      </p>
      <p class="event__duration">${duration.days() !== 0 ? `${duration.days()}D` : ''}
                                ${duration.hours() !== 0 ? `${duration.hours()}H` : ''}
                                ${duration.minutes() !== 0 ? `${duration.minutes()}M` : ''} </p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
     ${getOffersList(offers)}
    </ul>
    <button class="event__favorite-btn ${isFavourite}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
    </div>
  </li>`
  );
};

export default class PointView extends AbstractView{
  constructor(point, offers) {
    super();
    this.point = point;
    this.offers = offers;
  }

  get template() {
    return createPointTemplate(this.point, this.offers);
  }

  setOpenEditFormClickHandler = (callback) => {
    this._callback.openEditFormClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#openEditFormClickHandler);
  };

  setFavoritePointClickHandler = (callback) => {
    this._callback.favoritePointClick = callback;
    this.element.querySelector('.event__favorite-btn ').addEventListener('click', this.#favoritePointClickHandler);
  };

  #favoritePointClickHandler = () => {
    this._callback.favoritePointClick();
  };

  #openEditFormClickHandler = () => {
    this._callback.openEditFormClick();
  };
}

