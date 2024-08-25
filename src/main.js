import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import iconUrl from "../src/img/bi_x-octagon.png";
import { createGallery } from "./js/render-functions";
import { fetchPhotos } from "./js/pixabay-api";

const iconError = iconUrl;

const searchFormEl = document.querySelector('.form');
const loadingEl = document.querySelector('.loader')
const galleryListEl = document.querySelector('.gallery')
const loadMoreBtnEl = document.querySelector('.js-load-more-btn')

let currentPage = 1;
let searchedValue = '';
let cardHeight = 0;

const simpleBox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
      overlayOpacity: 0.8,
    });

const onSearchImg = async event => {
    try {
        event.preventDefault();

        searchedValue = searchFormEl.elements.search_img.value.trim();

        currentPage = 1;
                        
        if (!searchedValue) {
            iziToast.warning({
                title: 'Warning',
                message: 'Please fill the search field first.',
                position: 'topRight',
            }); 
            return;
        }
        
        loadingEl.classList.add('is-visible');
        
    const response = await fetchPhotos(searchedValue, currentPage);
    if (response.data.hits.length === 0) {
      loadMoreBtnEl.classList.add('is-hidden');
      iziToast.error({
        iconUrl: iconError,
        message: 'Sorry, there are no images matching your search query. Please try again!',
        messageColor: 'white',
        position: 'topRight',
        color: '#ef4040',
        maxWidth: '350px'
      });

       galleryListEl.innerHTML = '';
      
       return;
    };
      const gallaryCardsTemplate = response.data.hits.map(createGallery).join('');

      galleryListEl.innerHTML = gallaryCardsTemplate;
        
      const galleryCardEl = galleryListEl.querySelector('li');
      cardHeight = galleryCardEl.getBoundingClientRect().height;
      
        if (response.data.totalHits > 15) {
            loadMoreBtnEl.classList.remove('is-hidden');
        }
        
    simpleBox.refresh();
      
    searchFormEl.reset(); 
          
    } catch(err) {
        iziToast.error({
        iconUrl: iconError,
        message: err.message,
        messageColor: 'white',
        position: 'topRight',
        color: '#ef4040',
        maxWidth: '350px'
      });} finally {
        loadingEl.classList.remove('is-visible');
    }
};

const onLoadMoreClick = async () => { 
    try {
        currentPage++;

        loadMoreBtnEl.classList.add('is-hidden'); 
        loadingEl.classList.add('is-visible');

        const response = await fetchPhotos(searchedValue, currentPage);
        
        const gallaryCardsTemplate = response.data.hits.map(photoDetals => createGallery(photoDetals)).join('');

        galleryListEl.insertAdjacentHTML('beforeend', gallaryCardsTemplate);
       
        simpleBox.refresh();

        scrollBy({
            top: cardHeight*2,
            behavior: 'smooth'
        });

        loadMoreBtnEl.classList.remove('is-hidden'); 
        if (currentPage === Math.ceil(response.data.totalHits/15)) {
            loadMoreBtnEl.classList.add('is-hidden');
            iziToast.warning({
                title: 'Info',
                message: 'Were sorry, but youve reached the end of search results.',
                position: 'topRight',
    }); 
        };
    } catch(err) {
        iziToast.error({
        iconUrl: iconError,
        message: err.message,
        messageColor: 'white',
        position: 'topRight',
        color: '#ef4040',
        maxWidth: '350px'
      });
    } finally {
        loadingEl.classList.remove('is-visible');
}
};

searchFormEl.addEventListener('submit', onSearchImg);
loadMoreBtnEl.addEventListener('click', onLoadMoreClick); 