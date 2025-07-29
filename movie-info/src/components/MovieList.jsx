import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import MovieSlider from './MovieSlider';
import { options } from '../utils/apiOptions';

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
      <div
        className="flex flex-wrap justify-center
        gap-5 p-5 md:gap-4 md:p-4 sm:gap-3 sm:p-3"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={handleClick} />
        ))}
      </div>
    </div>
  );
}
