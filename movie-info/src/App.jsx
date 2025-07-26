import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useState } from 'react';
import './App.css';
import movieListData from './movieListData.json';
import MovieCard from './components/MovieCard';
import MovieSlider from './components/MovieSlider';

function App() {
  const [movieList] = useState(movieListData.results);

  return (
    <div className="app">
      <h1>🎬인기 영화 목록</h1>
      <div className="movie-slider-container">
        <MovieSlider movies={movieList} />
      </div>
      <div className="movie-list">
        {movieList.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            poster_path={movie.poster_path}
            title={movie.title}
            vote_average={movie.vote_average}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
