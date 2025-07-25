import { useState } from 'react';
import './App.css';
import movieListData from './movieListData.json';
import MovieCard from './components/MovieCard';
import MovieDetail from './components/MovieDetail';

function App() {
  const [movieList] = useState(movieListData.results);

  return (
    <div className="app">
      <h1>🎬인기 영화 목록</h1>
      <div className="movie-list">
        {movieList.map((movie) => (
          <MovieCard
            key={movie.id}
            poster_path={movie.poster_path}
            title={movie.title}
            vote_average={movie.vote_average}
          />
        ))}
      </div>
      <MovieDetail />
    </div>
  );
}

export default App;
