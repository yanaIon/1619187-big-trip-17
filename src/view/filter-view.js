import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<div class="trip-filters__filter">
    <input
    id="filter__${name}"
    class="trip-filters__filter-input  visually-hidden"
    type="radio"
    name="trip-filter"
    value=${name}
    ${isChecked ? 'checked' : ''}
    ${count === 0 ? 'disabled' : ''}
    />
    <label
    ${count === 0 ? 'disabled' : ''}
    class="trip-filters__filter-label"
    for="filter__${name}">${name}
    </label>
    </div>`);
};

const createFilterTemplate = (filterItems, currentFilter) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilter === filter.name))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
    </form>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();

    if(evt.target.attributes.disabled || !evt.target.htmlFor) { return; }

    const filter = evt.target.htmlFor.split('__')[1];
    this._callback.click(filter);
  };
}
