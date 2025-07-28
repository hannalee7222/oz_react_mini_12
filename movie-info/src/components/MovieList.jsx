import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import MovieSlider from './MovieSlider';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_TOKEN}`,
  },
};

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
          options
        );
        const data = await res.json();
        const filtered = data.results.filter((movie) => movie.adult === false);
        setMovies(filtered);
      } catch (error) {
        console.error('영화 데이터를 불러오는 데 실패했습니다.', error);
      }
    };

    fetchMovies();
  }, []);

  const handleClick = (id) => {
    navigate(`/movies/${id}`);
  };

  return (
    <div>
      <div className="movie-slider-container">
        <MovieSlider movies={movies} />
      </div>
      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={handleClick} />
        ))}
      </div>
    </div>
  );
}
