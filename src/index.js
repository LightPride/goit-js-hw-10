import debounce from 'lodash.debounce';
import './css/styles.css';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

import { fetchCountries } from './fetchCountries';

const refs = {
  searchBox: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();

  const name = e.target.value.trim();
  if (!name) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(name)
    .then(countries => {
      if (countries.length >= 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (countries.length === 1) {
        refs.countryList.innerHTML = '';
        makeMaxMarkup(countries);
      } else if (countries.length > 1 && countries.length <= 10) {
        refs.countryInfo.innerHTML = '';
        makeMiniMarkup(countries);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      
    });
}

function makeMiniMarkup(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li>
  <img src =${flags.png} alt='flags of ${name.official}' width=40 height=20/><span>${name.official}</span>
  </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function makeMaxMarkup(countries) {
  const markup = countries
    .map(({ flags, name, population, capital, languages }) => {
      return `<ul>
  <div class="upper-section">
    <img src =${flags.png} alt='flags of ${
        name.official
      }' width=40 height=20/><h2>${name.official}</h2>
  </div> 
  <div>
    <ul class="info-list">
      <li>
        <p>Population: <span>${capital}</span></p>
      <li>
      <li>
        <p>Capital: <span>${population}</span></p>
      </li>
      <li>
        <p>Languages: <span>${Object.values(languages).join(', ')}</span></p>
      </li>
    </ul>
  </div>
  </ul>`;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}
