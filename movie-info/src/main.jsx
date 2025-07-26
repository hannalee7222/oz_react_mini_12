import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import MovieDetail from './components/MovieDetail.jsx';
import Layout from './components/Layout.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<App />} />
        <Route path="details/:id" element={<MovieDetail />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
