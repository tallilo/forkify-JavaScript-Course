import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const lastPage = this._data.results.length / this._data.RESULT_PER_PAGE;
    if (this._data.page === 1) {
      //page 1 and there are not other pages

      if (this._data.RESULT_PER_PAGE >= this._data.results.length) return;
      //page 1 and there are other pagers
      return ` <button data-goto="${
        this._data.page + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    //laste page
    if (this._data.page >= lastPage) {
      return `<button data-goto="${
        this._data.page - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>`;
    }

    //other page
    return `<button data-goto="${
      this._data.page - 1
    }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${this._data.page - 1}</span>
          </button>
          <button data-goto="${
            this._data.page + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> `;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      console.log(btn);
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  /* addHandlerRender(prevHandler, nextHandler) {
    const prevButton = this._parentElement.querySelector(
      '.pagination__btn--prev'
    );
    console.log(prevButton);
    const nextButton = this._parentElement.querySelector(
      '.pagination__btn--next'
    );

    if (prevButton) {
      prevButton.addEventListener('click', function (e) {
        e.preventDefault();
        prevHandler();
      });
    }
    if (nextButton) {
      nextButton.addEventListener('click', function (e) {
        e.preventDefault();
        nextHandler();
      });
    }
  } */
}
export default new PaginationView();
