import {render} from './framework/render.js';
import ListPointPresenter from './presenter/events-list-presenter.js';
import PointsModel from './model/points-model.js';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import {generateFilter} from './util.js';
import FilterView from './view/filter-view.js';

dayjs.extend(duration);

const tripMain = document.querySelector('.trip-main');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filters = generateFilter(pointsModel.points);

render(new FilterView(filters), tripFilters);

const listPointPresenter = new ListPointPresenter(tripEvents, pointsModel);

listPointPresenter.init();
