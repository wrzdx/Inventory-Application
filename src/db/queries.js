import movies from './moviesQueries.js';
import directors from './directorsQueries.js';
import genres from './genresQueries.js';

const db = {
  ...movies,
  ...directors,
  ...genres
};


export default db;