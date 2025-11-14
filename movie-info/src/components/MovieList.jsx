//NOTE: 현재 라우팅/메인 페이지에서는 사용하지 않는 이전 버전 리스트 컴포넌트
//참고용으로 남겨둔 상태이며, 실제 화면에서는 렌더링되지 않음.

// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import MovieCard from './MovieCard';
// import MovieSlider from './MovieSlider';

// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// export default function MovieList() {
//   const [movies, setMovies] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMovies = async () => {
//       try {
//         const res = await fetch(
//           `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1&api_key=${API_KEY}`
//         );
//         if (!res.ok) throw new Error('영화 데이터를 불러오는 데 실패했습니다.');
//         const data = await res.json();
//         const filtered = data.results.filter((movie) => movie.adult === false);
//         setMovies(filtered);
//       } catch (error) {
//         console.error('영화 데이터를 불러오는 데 실패했습니다.', error);
//       }
//     };

//     fetchMovies();
//   }, []);

//   const handleClick = (id) => {
//     navigate(`/details/${id}`);
//   };

//   return (
//     <div>
//       <div className="movie-slider-container">
//         <MovieSlider />
//       </div>
//       <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
//         {movies.map((movie) => (
//           <MovieCard
//             key={movie.id}
//             id={movie.id}
//             poster_path={movie.poster_path}
//             title={movie.title}
//             vote_average={movie.vote_average}
//             onClick={handleClick}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
