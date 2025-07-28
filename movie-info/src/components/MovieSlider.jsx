import './MovieSlider.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';

export default function MovieSlider({ movies }) {
  const navigate = useNavigate()
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={16}
      slidesPerView={4}
      navigation
      pagination={{ clickable: true }}
    >
      {movies.map((movie) => (
        <SwiperSlide key={movie.id}>
          <div
            className="slider-card"
            onClick={() => navigate(`/details/${movie.id}`)}
          >
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
