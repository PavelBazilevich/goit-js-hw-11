import refs from './refs';
import Notiflix from 'notiflix';
import './sass/_common.scss';
import './sass/_search.scss';
import { fetchArticles } from './api-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
//  спроба
const perPage = 40;
let page = 1;
let searchQuery = '';
let simpleGalery = new SimpleLightbox('.galery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  overlay: true,
  enableKeyboard: true,
});

const renderMarkup = arr => {
  const markup = arr
    .map(image => {
      return `<div class="photo-card">
                    <a class="gallery-link" href="${image.largeImageURL}">
                        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" class="gallery-image"/>
                    </a>
                    <div class="info">
                        <p class="info-item">
                        <b>Likes</b> ${image.likes}
                        </p>
                        <p class="info-item">
                        <b>Views</b> ${image.views}
                        </p>
                        <p class="info-item">
                        <b>Comments</b> ${image.comments}
                        </p>
                        <p class="info-item">
                        <b>Downloads</b> ${image.downloads}
                        </p>
                    </div>
                </div>`;
    })
    .join('');
  refs.galleryListRef.insertAdjacentHTML('beforeend', markup);
};

const changePage = hits => {
  renderMarkup(hits);
  simpleGalery.refresh();
  page += 1;
};

const searchPhoto = async event => {
  event.preventDefault();
  const searchQuery = event.currentTarget.elements.searchQuery.value;
  page = 1;
  refs.galleryListRef.innerHTML = '';
  if (searchQuery === '') {
    Notiflix.Notify.failure('Please enter something');
    return;
  }

  try {
    const { data } = await fetchArticles(searchQuery, page, perPage);
    if (!data.totalHits) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    changePage(data.hits);
    refs.loadMore.classList.toggle('is-hidden');
    if (data.totalHits <= perPage) {
      setTimeout(() => {
        Notify.info('There are all images matching your search query.');
        refs.loadMore.classList.toggle('is-hidden');
        return;
      }, 1000);
    }
  } catch (error) {
    console.error(error);
    console.log(error);
  }
};

const loadMoreContent = async () => {
  try {
    const { data } = await fetchArticles(searchQuery, page, perPage);
    const PAGES = data.totalHits / perPage;
    if (page >= PAGES) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMore.classList.toggle('is-hidden');
    }
    changePage(data.hits);
  } catch (error) {
    console.log(error);
  }
};

function oneClick(event) {
  event.preventDefault();
}

refs.galleryListRef.addEventListener('click', oneClick);
refs.searchForm.addEventListener('submit', searchPhoto);
refs.loadMore.addEventListener('click', loadMoreContent);
