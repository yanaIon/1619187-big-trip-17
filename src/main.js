import {render} from './framework/render.js';
import ListPointPresenter from './presenter/events-list-presenter.js';
import PointsModel from './model/points-model.js';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import FilterView from './view/filter-view.js';

dayjs.extend(duration);

const tripMain = document.querySelector('.trip-main');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');


render(new FilterView(), tripFilters);
const pointsModel = new PointsModel();
const listPointPresenter = new ListPointPresenter(tripEvents, pointsModel);

listPointPresenter.init();
