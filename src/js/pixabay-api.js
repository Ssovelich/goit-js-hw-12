import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/';

export const fetchPhotos = (searchedQuery, page) => { 
    const axiosOptions = {
        params: {
            key: '45417636-6e508772373129b2f08d1fd3e',
            q: searchedQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            per_page: 15,
            page: page
        }
    };

    return axios.get('/api/', axiosOptions);
}; 