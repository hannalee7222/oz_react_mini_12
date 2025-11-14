import './MovieSlider.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function MovieSlider() {
  const [nowMovies, setNowMovies] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1&api_key=${API_KEY}`
        );

        if (!res.ok) throw new Error('Now Playing 데이터 요청 실패');
        const data = await res.json();
        const filtered = data.results.filter((movie) => !movie.adult);
        setNowMovies(filtered);
      } catch (error) {
        console.error('Now Playing 데이터를 불러오는 데 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
  }, []);

  if (loading) {
    return <p className="loading">로딩 중...</p>;
  }

  const handleClick = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <Swiper
      className="pb-6 sm:pb-6 md:pb-5"
      slidesPerView={4}
      modules={[Navigation]}
      spaceBetween={16}
      navigation
      breakpoints={{
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 5 },
      }}
    >
      {nowMovies.map((movie) => (
        <SwiperSlide key={movie.id}>
          <div
            className="text-center cursor-pointer"
            onClick={() => handleClick(movie.id)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover rounded-md transition-transform duration-200 hover:scale-105"
            />
            <h3 className="mt-2 text-lg md:text-xl font-bold">{movie.title}</h3>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
