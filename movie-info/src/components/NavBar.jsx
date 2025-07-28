import React from 'react';
import './NavBar.css';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="logo">
        OZ 무비<span className="dot">.</span>
      </div>
      <input type="text" className="search-input" placeholder="영화 검색..." />
      <div className="nav-buttons">
        <button className="login-btn">로그인</button>
        <button className="signup-btn">회원가입</button>
      </div>
    </nav>
  );
}
