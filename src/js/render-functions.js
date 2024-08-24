export const createGallery = (photoInfo) => {
  return `
  <li class='gallery-item'>
    <a class='gallery-link' href='${photoInfo.largeImageURL}'>
      <img
        class='gallery-image'
        src='${photoInfo.webformatURL}'
        alt='${photoInfo.tags}'
        width=360
        height=152/>
    </a>
    <ul class='photo-info-list'>
      <li class='photo-info-list-item'><h2>Likes</h2><p>${photoInfo.likes}</p></li>
      <li class='photo-info-list-item'><h2>Views</h2><p>${photoInfo.views}</p></li>
      <li class='photo-info-list-item'><h2>Comments</h2><p>${photoInfo.comments}</p></li>
      <li class='photo-info-list-item'><h2>Downloads</h2><p>${photoInfo.downloads}</p></li>
    </ul>
  </li>`
 };