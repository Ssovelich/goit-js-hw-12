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

const onSearchImg = async event => {
    try {
        event.preventDefault();

        searchedValue = searchFormEl.elements.search_img.value.trim();

        currentPage = 1;
        loadMoreBtnEl.classList.add('is-hidden');
        
        const response = await fetchPhotos(searchedValue, currentPage);
      
        if (!searchedValue) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please fill the search field first.',
      position: 'topRight',
    }); 
    searchFormEl.elements.search_img.value = '';
    return;
  }
   
  loadingEl.classList.add('is-visible');

fetchPhotos((searchedValue, currentPage))
    
    if (response.data.hits.length === 0) {
      iziToast.error({
        iconUrl: `${iconError}`,
        message: 'Sorry, there are no images matching your search query. Please try again!',
        messageColor: 'white',
        position: 'topRight',
        color: '#ef4040',
        maxWidth: '350px'
      });

      loadingEl.classList.remove('is-visible');
      galleryListEl.innerHTML = '';
      
      searchFormEl.reset();
    };
      const gallaryCardsTemplate = response.data.hits.map(photoDetals => createGallery(photoDetals)).join('');

      galleryListEl.innerHTML = gallaryCardsTemplate;
        
      const galleryCardEl = galleryListEl.querySelector('li');
      cardHeight = galleryCardEl.getBoundingClientRect().height;
      
      loadMoreBtnEl.classList.remove('is-hidden'); 
    
    const simpleBox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
      overlayOpacity: 0.8,
    });
    simpleBox.refresh();
      
    loadingEl.classList.remove('is-visible');
    searchFormEl.reset(); 
  
        
    } catch(err) {
        console.log(err);
    }
};

const onLoadMoreClick = async event => { 
    try {
        currentPage++;

        loadMoreBtnEl.classList.add('is-hidden'); 
        loadingEl.classList.add('is-visible');

        const response = await fetchPhotos(searchedValue, currentPage);
        
        const gallaryCardsTemplate = response.data.hits.map(photoDetals => createGallery(photoDetals)).join('');

        galleryListEl.insertAdjacentHTML('beforeend', gallaryCardsTemplate);

        const simpleBox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250,
            overlayOpacity: 0.8,
    });

        scrollBy({
            top: cardHeight*2,
            behavior: 'smooth'

        });

        loadingEl.classList.remove('is-visible');
        loadMoreBtnEl.classList.remove('is-hidden'); 
        if (currentPage === response.data.totalHits) {
            loadMoreBtnEl.classList.add('is-hidden');
            iziToast.warning({
                title: 'Info',
                message: 'Were sorry, but youve reached the end of search results.',
                position: 'topRight',
    }); 
        };
    } catch(err) {
        console.log(err);
}
};

searchFormEl.addEventListener('submit', onSearchImg);
loadMoreBtnEl.addEventListener('click', onLoadMoreClick); 