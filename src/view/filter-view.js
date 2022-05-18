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
    class="trip-filters__filter-label"
    for="filter__${name}">${name}
    </label>
    </div>`);
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
    </form>`;
};

export default class FilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
