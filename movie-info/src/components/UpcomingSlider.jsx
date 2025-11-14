import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function UpcomingSlider() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?language=ko-KR&region=KR&page=1&api_key=${API_KEY}`
        );

        if (!res.ok)
          throw new Error('상영 예정작 데이터를 불러오지 못했습니다.');
        const data = await res.json();

        const filtered = data.results.filter((movie) => movie.adult === false);
        setMovies(filtered);
      } catch (error) {
        console.error('상영 예정작 데이터를 불러오는 데 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  const handleClick = useCallback(
    (id) => {
      navigate(`/details/${id}`);
    },
    [navigate]
  );

  if (loading) {
    return <p className="loading">상영 예정작 불러오는 중...</p>;
  }

  if (!movies.length) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg md:text-xl font-semibold text-black dark:text-white">
        🎞️ 상영 예정작
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
