import {render} from './framework/render.js';
import ListPointPresenter from './presenter/events-list-presenter.js';
import FilterPresenter from './presenter/events-filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';

import NewPointButtonView from './view/new-point-button-view.js';

dayjs.extend(duration);


const tripMain = document.querySelector('.trip-main');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const newPointButtonComponent = new NewPointButtonView();


const filterPresenter = new FilterPresenter(tripFilters, filterModel, pointsModel);
filterPresenter.init();


const listPointPresenter = new ListPointPresenter(tripEvents, pointsModel, filterModel);

listPointPresenter.init();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};


const handleNewPointButtonClick = () => {
  listPointPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};
newPointButtonComponent.setClickHandler(handleNewPointButtonClick);

render(newPointButtonComponent, tripMain);
