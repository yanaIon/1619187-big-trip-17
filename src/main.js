import {render} from './framework/render.js';
import ListPointPresenter from './presenter/list-point-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';

import NewPointButtonView from './view/new-point-button-view.js';
import NoPointView from './view/no-point-view.js';
import PointsApiService from './points-api-service.js';

dayjs.extend(duration);

const AUTHORIZATION = 'Basic KQtTfd9xxbL8HPjD';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';

const tripMain = document.querySelector('.trip-main');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));


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


pointsModel.init().then(() => {
  newPointButtonComponent.setClickHandler(handleNewPointButtonClick);

  render(newPointButtonComponent, tripMain);
}).catch(() => {
  listPointPresenter.destroy();
  const noPointComponent = new NoPointView('Some error happened. Try later');
  render(noPointComponent, tripEvents);

});
