import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #editPointComponent = null;
  #point = null;
  #changeMode = null;
  #changeData = null;
  #mode = Mode.DEFAULT;

  constructor(pointListContainer,changeData, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#changeMode = changeMode;
    this.#changeData = changeData;
  }

  init = (point, listOffers, listDestinations) => {
    this.#point = point;

    const offers = this.#point.offers.map((offerId) => {
      let result;

      listOffers.forEach((offersGroup) => {
        offersGroup.offers.forEach((offer) => {
          if(offer.id === offerId) {
            result = offer;
          }
        });
      });

      return result;
    }
    );

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(point,offers);
    this.#editPointComponent = new EditPointView(point,listOffers, listDestinations);

    this.#pointComponent.setOpenEditFormClickHandler(() => {
      this.#replacePointToForm();
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setPointDeleteHandler(this.#handleDeletePoint);
    this.#editPointComponent.setCloseEditFormClickHandler(() => {
      this.resetView();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#pointComponent.setFavoritePointClickHandler(this.#handleFavoriteClick);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    replace(this.#pointComponent, this.#editPointComponent);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #handleFormSubmit = (update) => {
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      update,
    );

    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };


  #handleDeletePoint = () => {
    this.#changeData(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      this.#point,
    );

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
