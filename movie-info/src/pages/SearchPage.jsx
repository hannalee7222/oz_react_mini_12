import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMoviesBySearch = async (query) => {
    try {
      const url = `${BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}&language=ko-KR&include_adult=false&api_key=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('영화 검색 실패');
      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error('검색오류', error);
      return [];
    }
  };

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    fetchMoviesBySearch(query).then((results) => {
      const filtered = results.filter((movie) => {
        const genres = movie.genre_ids || [];

        const hasDramaAndRomance =
          genres.includes(18) || genres.includes(10749);

        return movie.adult === false && !hasDramaAndRomance;
      });
      setMovies(filtered);
      setLoading(false);
    });
  }, [query]);

  const handleClick = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">"{query}" 검색 결과</h2>

      {loading ? (
        <p className="text-sm text-gray-500">🔎검색 중 입니다.</p>
      ) : movies.length === 0 ? (
        <p className="text-sm text-gray-500">🙃검색 결과가 없습니다.</p>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              poster_path={movie.poster_path}
              title={movie.title}
              vote_average={movie.vote_average}
              onClick={() => handleClick(movie.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
