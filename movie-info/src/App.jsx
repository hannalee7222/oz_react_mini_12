import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import MovieCard from './components/MovieCard';
import MovieSlider from './components/MovieSlider';
import UpcomingSlider from './components/UpcomingSlider';
import OttSlider from './components/OttSlider';

import { useNavigate } from 'react-router-dom';
import { throttle } from 'lodash';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function App() {
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);

  //무한 스크롤 상태
  const [page, setPage] = useState(1); //현재 페이지
  const [hasMore, setHasMore] = useState(true); //대기 페이지
  const [isFetching, setIsFetching] = useState(false); //fetching 여부확인
  const navigate = useNavigate();

  const pageRef = useRef(page);
  const hasMoreRef = useRef(hasMore);
  const isFetchingRef = useRef(isFetching);
  const fetchMoviesRef = useRef(null);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);
  useEffect(() => {
    isFetchingRef.current = isFetching;
  }, [isFetching]);

  const fetchMovies = useCallback(async (pageToLoad) => {
    try {
      setIsFetching(true);
      if (pageToLoad === 1) {
        setLoading(true);
      }

      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${pageToLoad}&api_key=${API_KEY}`
      );
      if (!res.ok) throw new Error('영화 데이터를 불러오는 데 실패했습니다.');
      const data = await res.json();

      //유해물 최대한 차단
      const filtered = data.results.filter((movie) => movie.adult === false);

      //페이지 1이면 filtered 기본세팅, 그 이후로는 이어붙이기
      setMovieList((prev) =>
        pageToLoad === 1 ? filtered : [...prev, ...filtered]
      );

      //페이지 여부 확인
      if (pageToLoad >= data.total_pages) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      //현재 페이지 갱신
      setPage(pageToLoad);
    } catch (error) {
      console.error('영화 데이터를 불러오는 데 실패했습니다.', error);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoviesRef.current = fetchMovies;
  }, [fetchMovies]);

  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  const handleScrollThrottled = useMemo(
    () =>
      throttle(() => {
        if (isFetchingRef.current) return;
        if (!hasMoreRef.current) return;

        const scrollPosition = window.scrollY + window.innerHeight;
        const threshold = document.documentElement.scrollHeight - 200;

        //한계점 도달하면 다음 페이지 요청
        if (scrollPosition >= threshold) {
          const nextPage = (pageRef.current ?? 1) + 1;
          fetchMoviesRef.current?.(nextPage);
        }
      }, 300), //300ms마다 라는 조건걸기
    []
  );

  //스크롤 이벤트
  useEffect(() => {
    window.addEventListener('scroll', handleScrollThrottled);
    return () => {
      //이벤트 cleanup
      window.removeEventListener('scroll', handleScrollThrottled);
    };
  }, [handleScrollThrottled]);

  useEffect(() => {
    return () => handleScrollThrottled.cancel();
  }, [handleScrollThrottled]);

  const handleClick = (id) => {
    navigate(`/details/${id}`);
  };

  if (loading && page === 1) {
    return <p className="loading">로딩 중...</p>;
  }

  return (
    <div className="app">
      <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-3">
        🎬 현재 상영작
      </h1>
      <div className="movie-slider-container mb-6">
        <MovieSlider />
      </div>

      {/*서브 슬라이더*/}
      <section className="space-y-4 md:space-y-6">
        {/*순서: 상영예정작-넷플릭스-디즈니+-웨이브-왓챠-애플tv */}
        <UpcomingSlider />

        <OttSlider title="넷플릭스 인기작" providerKeys={['netflix']} />
        <OttSlider title="디즈니+ 인기작" providerKeys={['disney_plus']} />
        <OttSlider title="웨이브 인기작" providerKeys={['wavve']} />
        <OttSlider title="쿠팡플레이 인기작" providerKeys={['coupang_play']} />
        <OttSlider title="티빙 인기작" providerKeys={['tving']} />
        <OttSlider title="구글플레이 인기작" providerKeys={['google_play']} />
        <OttSlider
          title="아마존 프라임 비디오 인기작"
          providerKeys={['amazon_prime']}
        />
      </section>

      {/*인기 영화 무한그리드*/}
      <h2 className="mt-10 mb-3 text-lg md:text-xl font-semibold text-black dark:text-white">
        🍿 인기 영화 둘러보기
      </h2>
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
            onClick={handleClick}
          />
        ))}
      </div>

      {/*추가 로딩 상태 표시 */}
      {isFetching && (
        <p className="text-center text-gray-500 py-4">영화 불러오는 중...</p>
      )}
      {!hasMore && (
        <p className="text-center text-gray-400 py-4 text-sm">
          모든 영화 정보를 다 불러왔어요.
        </p>
      )}
    </div>
  );
}

export default App;
