import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { throttle } from 'lodash';
import MovieCard from '../components/MovieCard';
import OttFilter from '../components/OttFilter';
import options from '../utils/apiOptions';
import { getProviderIdsFromKeys } from '../utils/ottProviders';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const WATCH_REGION = 'KR';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';

  const initialOtts = (searchParams.get('ott') ?? '')
    .split(',')
    .filter(Boolean);

  const [selectedOtts, setSelectedOtts] = useState(initialOtts);

  useEffect(() => {
    const ottFromUrl = (searchParams.get('ott') ?? '')
      .split(',')
      .filter(Boolean);
    setSelectedOtts(ottFromUrl);
  }, [searchParams]);

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const pageRef = useRef(page);
  const hasMoreRef = useRef(hasMore);
  const isFetchingRef = useRef(isFetching);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);
  useEffect(() => {
    isFetchingRef.current = isFetching;
  }, [isFetching]);

  const applyBaseFilters = (results = []) => {
    return results.filter((movie) => {
      return movie.adult === false;
    });
  };

  const filterMoviesByOtt = useCallback(
    async (moviesToFilter) => {
      const providerIds = getProviderIdsFromKeys(selectedOtts);
      if (!providerIds.length) return moviesToFilter;

      const providerIdStrings = providerIds.map(String);
      const filtered = [];

      await Promise.all(
        moviesToFilter.map(async (movie) => {
          try {
            const res = await fetch(
              `${BASE_URL}/movie/${movie.id}/watch/providers`,
              options //Bearer 토큰
            );
            if (!res.ok) throw new Error('OTT 정보 가져오기 실패');
            const data = await res.json();

            const country = data.results?.[WATCH_REGION];
            const allOffers = [
              ...(country?.flatrate || []),
              ...(country?.rent || []),
              ...(country?.buy || []),
              ...(country?.ads || []),
              ...(country?.free || []),
            ];

            const hasProvider = allOffers.some((offer) =>
              providerIdStrings.includes(String(offer.provider_id))
            );

            if (hasProvider) {
              filtered.push(movie);
            }
          } catch (err) {
            console.error('OTT 정보 조회 오류', err);
          }
        })
      );

      return filtered;
    },
    [selectedOtts]
  );

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

        let filtered = applyBaseFilters(data.results || []);
        filtered = await filterMoviesByOtt(filtered);

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
    [query, filterMoviesByOtt]
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
          loadMovies(nextPage);
        }
      }, 300), //300ms마다 라는 조건걸기
    [loadMovies]
  );

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

  const handleClick = useCallback(
    (id) => {
      navigate(`/details/${id}`);
    },
    [navigate]
  );

  //ott필터 변경 시 URL쿼리도 같이 업데이트
  const handleOttChange = (nextSelected) => {
    setSelectedOtts(nextSelected);

    const params = new URLSearchParams(searchParams);
    if (nextSelected.length) {
      params.set('ott', nextSelected.join(','));
    } else {
      params.delete('ott');
    }
    setSearchParams(params);
  };

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-2">
        "{query}" 검색 결과
        {selectedOtts.length > 0 && (
          <span className="text-sm text-purple-300 ml-2">
            (OTT 필터 적용됨)
          </span>
        )}
      </h2>

      {/*검색 결과 OTT 필터 UI*/}
      <OttFilter selectedOtts={selectedOtts} onChange={handleOttChange} />

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
                onClick={handleClick}
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
