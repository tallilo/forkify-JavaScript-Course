import View from './View';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _Message = 'the recipy was uploaded succesfuly!!!';
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHiddeWindow();
  }
  toggelWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggelWindow.bind(this));
  }
  _addHandlerHiddeWindow() {
    this._btnClose.addEventListener('click', this.toggelWindow.bind(this));
    this._overlay.addEventListener('click', this.toggelWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  /* _generateMarkup() {} */
}
export default new AddRecipeView();
