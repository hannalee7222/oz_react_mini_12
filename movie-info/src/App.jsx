import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';
import './App.css';
import MovieCard from './components/MovieCard';
import MovieSlider from './components/MovieSlider';
import { useSupabaseAuth } from './supabase/useSupabaseAuth';
import options from './utils/apiOptions';

function App() {
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getUserInfo } = useSupabaseAuth();

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  useEffect(() => {
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
      <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white">
        🎬현재 상영작
      </h1>
      <div className="movie-slider-container">
        <MovieSlider movies={movieList} />
      </div>
      <div
        className="
       grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
      "
      >
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
