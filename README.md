## 🎬 OZ 무비 <span style="color: #a855f7;">.</span> (React + TMDB + Supabase)

사용자가 원하는 영화를 검색하고, OTT별 필터링·북마크·댓글 기능을 통해
자신만의 영화 정보를 관리할 수 있는 영화 정보 웹사이트입니다.
TMDB API를 기반으로 다양한 영화 데이터를 제공하며,
회원 시스템을 통해 사용자 프로필과 활동 내역을 저장합니다.

## 🚀 프로젝트 소개

이 프로젝트는 React 기반의 SPA 영화 정보 사이트로,
TMDB API를 활용하여 영화 목록/상세정보를 불러오고,
Supabase로 회원관리·프로필·북마크·댓글 데이터를 저장하는 구조로 되어 있습니다.

검색 기능, 필터링 기능, 개인화 기능 등을 포함하며
실제 영화 서비스처럼 사용할 수 있는 UX를 목표로 개발되었습니다.

## 🛠 기술 스택

Frontend

React 18 / React hooks

React Router DOM

Vite

Tailwind CSS

Lodash (debounce, throttle)

React-Toastify

Swiper.js

Zustand (다크모드 상태 관리)

Backend / Database

Supabase Authentication

Supabase Database(PostgreSQL)

Supabase Storage(프로필 이미지)

Supabase Row Level Security(정책)

API

TMDB API (영화 목록, 검색, 상세정보, OTT Watch Providers)

Dev & Etc

Git / GitHub

.env 환경 변수 관리

ESLint 일부 룰 적용

## ✨ 주요 기능

🎥 1. 메인 페이지

TMDB 인기 영화 실시간 조회

OTT별 인기작/개봉 예정작 슬라이더 구현

무한 스크롤 방식으로 영화 계속 불러오기

우측 하단 Top 버튼으로 부드러운 스크롤 이동

🔍 2. 검색 기능

검색창 입력 → TMDB API 기반 실시간 검색

Debounce 적용으로 API 호출 최적화

OTT별 필터 선택 가능 (넷플릭스/디즈니+/티빙/웨이브 등)

검색 후에도 필터 재선택 및 재검색 가능하도록 개선

필터 드롭다운: 외부 클릭 시 자동 닫힘 (UX 개선)

긴 영화 제목 간 텍스트 겹침 방지 레이아웃 조정

👤 3. 회원가입 / 로그인

Supabase Auth 기반 이메일 회원가입

소셜 로그인 (Google / Kakao)

로그인 시 LocalStorage에 사용자 정보 저장

전역 State로 로그인 유지

🧰 4. 마이페이지 (My Page)

프로필 이미지 업로드 (Supabase Storage 사용)

닉네임 설정 및 수정

내가 북마크한 영화 목록 표시

내가 남긴 댓글 목록 표시 및 개별 삭제 가능

⭐ 5. 북마크 기능

영화 상세페이지에서 북마크 추가/해제

마이페이지에서 전체 또는 개별 삭제 가능

Supabase에 유저별 북마크 저장

💬 6. 댓글 기능

영화 상세 페이지에서 댓글 작성(닉네임 또는 마스킹된 이메일 표시)

선택한 감정(이모지) 표시

유저별 댓글 기록 마이페이지에서 관리

댓글 삭제 가능

🌙 7. 다크모드

Zustand 기반 전역 테마 상태 관리

라이트/다크 모드 스위치

새로고침 시에도 테마 유지

🧩 8. 기타 기능

반응형 디자인 (모바일/태블릿/데스크탑)

TMDB Watch Provider 활용하여 제작한 각 슬라이더에 OTT 로고 표시

.env 파일을 통한 API 키 보안 관리

이미지 없는 영화에 대한 fallback 처리
