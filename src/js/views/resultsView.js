import View from './View';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'We could not find that result. Please try again!';
  _message = '';

  _generateMarkup() {
    console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();

/*  id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url, */
