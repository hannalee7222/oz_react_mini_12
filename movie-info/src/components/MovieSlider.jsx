import './MovieSlider.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function MovieSlider({ movies }) {
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
            onClick={() => (window.location.href = `/movie/${movie.id}`)}
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
