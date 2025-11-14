import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { getProviderIdsFromKeys, OTT_PROVIDERS } from '../utils/ottProviders';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function OttSlider({ title, providerKeys }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const provider = OTT_PROVIDERS.find((p) => p.id === providerKeys[0]);
  const logo = provider?.logo;

  useEffect(() => {
    const fetchOttMovies = async () => {
      try {
        setLoading(true);

        const providerIds = getProviderIdsFromKeys(providerKeys).join('|');
        if (!providerIds) {
          setMovies([]);
          return;
        }

        const url = new URL('https://api.themoviedb.org/3/discover/movie');
        url.searchParams.set('api_key', API_KEY);
        url.searchParams.set('language', 'ko-KR');
        url.searchParams.set('sort_by', 'popularity.desc');
        url.searchParams.set('page', '1');
        url.searchParams.set('include_adult', 'false');
        url.searchParams.set('watch_region', 'KR');
        url.searchParams.set('with_watch_providers', providerIds);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('OTT별 데이터를 불러오지 못했습니다.');

        const data = await res.json();
        const filtered = data.results.filter((movie) => movie.adult === false);
        setMovies(filtered);
      } catch (error) {
        console.error('데이터를 불러오는 데 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOttMovies();
  }, [providerKeys]);

  const handleClick = useCallback(
    (id) => {
      navigate(`/details/${id}`);
    },
    [navigate]
  );

  if (loading) {
    return <p className="loading">{title} 불러오는 중...</p>;
  }

  if (!movies.length) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-3 flex items-center gap-2 text-lg md:text-xl font-semibold text-black dark:text-white">
        {logo && (
          <img
            src={logo}
            alt={provider.label}
            className="w-8 h-8 object-contain"
          />
        )}
        {title}
      </h2>
      <Swiper
        className="pb-4"
        modules={[Navigation]}
        navigation
        spaceBetween={12}
        slidesPerView={3}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div
              className="text-center cursor-pointer"
              onClick={() => handleClick(movie.id)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover rounded-md transition-transform duration-200 hover:scale-105"
              />
              <h3 className="mt-2 text-sm md:text-base font-medium truncate">
                {movie.title}
              </h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
