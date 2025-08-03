import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import Layout from './components/Layout.jsx';
import SearchPage from './pages/SearchPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SupabaseProvider } from './supabase/SupabaseProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SupabaseProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="details/:id" element={<MovieDetail />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
      </Routes>
    </SupabaseProvider>
  </BrowserRouter>
);
