import './MovieSlider.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { options } from '../utils/apiOptions';

export default function MovieSlider() {
  const [nowMovies, setNowMovies] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          'https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1',
          options
        );
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
      modules={[Navigation, Pagination]}
      spaceBetween={16}
      slidesPerView={4}
      navigation
      pagination={{ clickable: true }}
    >
      {nowMovies.map((movie) => (
        <SwiperSlide key={movie.id}>
          <div className="slider-card" onClick={() => handleClick(movie.id)}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="slider-poster"
            />
            <h3 className="slider-title">{movie.title}</h3>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
