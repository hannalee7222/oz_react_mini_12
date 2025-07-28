import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';
import './App.css';
import MovieCard from './components/MovieCard';
import MovieSlider from './components/MovieSlider';

function App() {
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_TOKEN}`,
      },
    };
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
          options
        );
        const data = await res.json();
        const filtered = data.results.filter((movie) => movie.adult === false);
        setMovieList(filtered);
      } catch (error) {
        console.error('영화 데이터를 불러오는 데 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <p className="loading">로딩 중...</p>;
  }

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
