import axios from 'axios';
// Ваш ключ API:29834380-00058cdf7f3ce3b5b4cca9ee7
const apiKey = '29834380-00058cdf7f3ce3b5b4cca9ee7';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchArticles = (inputValue, page, perPage) => {
  const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${inputValue}&page=${page}&${perPage}&lang=uk,ru&key=${apiKey}`;
  return axios.get(url);
};





