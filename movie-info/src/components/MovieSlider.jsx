import './MovieSlider.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_TOKEN}`,
  },
};

export default function MovieSlider() {
  const [topMovies, setTopMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await fetch(
          'https://api.themoviedb.org/3/movie/upcoming?language=ko-KR&page=1',
          options
        );
        const data = await res.json();
        const filtered = data.results.filter((movie) => !movie.adult);
        setTopMovies(filtered);
      } catch (error) {
        console.error('Top rated 데이터를 불러오는 데 실패했습니다.', error);
      }
    };

    fetchTopRated();
  }, []);

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
      {topMovies.map((movie) => (
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
