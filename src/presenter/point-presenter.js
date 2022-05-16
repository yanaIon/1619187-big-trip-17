import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

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
  #mode = Mode.DEFAULT;

  constructor(pointListContainer, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#changeMode = changeMode;
  }

  init = (point, listOffers, listDestinations, updatePointItem) => {
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

    const destination = listDestinations.find((destinationItem) => destinationItem.name === this.#point.destination);

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(point,offers);
    this.#editPointComponent = new EditPointView(point,listOffers, destination);

    this.#pointComponent.setOpenEditFormClickHandler(() => {
      this.#replacePointToForm();
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#editPointComponent.setFormSubmitHandler(() => {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#editPointComponent.setCloseEditFormClickHandler(() => {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#pointComponent.setFavoritePointClickHandler(updatePointItem);

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
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };
}
