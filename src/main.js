import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import InfoView from './view/trip-info-view.js';
import {render} from './render.js';
import ListPointPresenter from './presenter/events-list-presenter.js';
import PointsModel from './model/points-model.js';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';

dayjs.extend(duration);

const tripMain = document.querySelector('.trip-main');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

render(new InfoView(), tripMain, 'afterbegin');
render(new FilterView(), tripFilters);
render(new SortView(), tripEvents);

const pointsModel = new PointsModel();
const listPointPresenter = new ListPointPresenter();

listPointPresenter.init(tripEvents, pointsModel);
