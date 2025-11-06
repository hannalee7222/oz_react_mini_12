import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { throttle } from 'lodash';
import MovieCard from '../components/MovieCard';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const pageRef = useRef(page);
  const hasMoreRef = useRef(hasMore);
  const isFetchingRef = useRef(isFetching);
  const loadMoviesRef = useRef(null);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);
  useEffect(() => {
    isFetchingRef.current = isFetching;
  }, [isFetching]);

  const loadMovies = useCallback(
    async (pageToload) => {
      if (!query) return;
      try {
        setIsFetching(true);
        if (pageToload === 1) {
          setLoading(true);
        }

        const url = `${BASE_URL}/search/movie?query=${encodeURIComponent(
          query
        )}&language=ko-KR&include_adult=false&page=${pageToload}&api_key=${API_KEY}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('영화 검색 실패');
        const data = await res.json();

        const filtered = (data.results || []).filter((movie) => {
          const genres = movie.genre_ids || [];
          const hasDramaOrRomance =
            genres.includes(18) || genres.includes(10749);

          return movie.adult === false && !hasDramaOrRomance;
        });

        setMovies((prev) =>
          pageToload === 1 ? filtered : [...prev, ...filtered]
        );

        if (pageToload >= data.total_pages) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setPage(pageToload);
      } catch (error) {
        console.error('검색오류', error);
      } finally {
        setIsFetching(false);
        setLoading(false);
      }
    },
    [query]
  );

  const handleScrollThrottled = useMemo(
    () =>
      throttle(() => {
        if (isFetchingRef.current) return;
        if (!hasMoreRef.current) return;

        const scrollPosition = window.scrollY + window.innerHeight;
        const threshold = document.documentElement.scrollHeight - 200;

        //한계점 도달하면 다음 페이지 요청
        if (scrollPosition >= threshold) {
          const nextPage = (pageRef.current ?? 0) + 1;
          loadMoviesRef.current?.(nextPage);
        }
      }, 300), //300ms마다 라는 조건걸기
    []
  );

  useEffect(() => {
    loadMoviesRef.current = loadMovies;
  }, [loadMovies]);

  useEffect(() => {
    if (!query) return;
    setMovies([]);
    setPage(0);
    setHasMore(true);
    loadMovies(1);
  }, [query, loadMovies]);

  //스크롤 이벤트
  useEffect(() => {
    if (!query) return;
    window.addEventListener('scroll', handleScrollThrottled);
    return () => {
      //이벤트 cleanup
      window.removeEventListener('scroll', handleScrollThrottled);
    };
  }, [query, handleScrollThrottled]);

  useEffect(() => {
    return () => handleScrollThrottled.cancel();
  }, [handleScrollThrottled]);

  const handleClick = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">"{query}" 검색 결과</h2>

      {loading && page === 0 ? (
        <p className="text-sm text-gray-500">🔎검색 중 입니다.</p>
      ) : movies.length === 0 ? (
        <p className="text-sm text-gray-500">🙃검색 결과가 없습니다.</p>
      ) : (
        <>
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

          {isFetching && (
            <p className="text-center text-gray-500 py-4">
              영화 불러오는 중...
            </p>
          )}
          {!hasMore && movies.length > 0 && (
            <p className="text-center text-gray-400 py-4 text-sm">
              모든 영화 정보를 다 불러왔어요.
            </p>
          )}
        </>
      )}
    </section>
  );
}
