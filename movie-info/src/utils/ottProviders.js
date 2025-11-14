//OTT별 TMDb watch_provider ID 매핑
//한국에서 많이 이용하는 OTT위주로 선정함

export const OTT_PROVIDERS = [
  {
    id: 'netflix',
    tmdbId: 8,
    label: '넷플릭스',
    logo: '/images/Netflix-Symbol.png',
  },
  {
    id: 'disney_plus',
    tmdbId: 337,
    label: '디즈니+',
    logo: '/images/Disney+_logo.svg',
  },
  {
    id: 'apple_tv',
    tmdbId: 2,
    label: '애플 TV',
  },
  { id: 'wavve', tmdbId: 356, label: '웨이브', logo: '/images/wavve_logo.jpg' },
  { id: 'tving', tmdbId: 97, label: '티빙', logo: '/images/tving_logo.webp' },
  { id: 'watcha', tmdbId: 96, label: '왓차' },
  {
    id: 'amazon_prime',
    tmdbId: 119,
    label: '아마존 프라임 비디오',
    logo: '/images/amazonprime_logo.png',
  },
  {
    id: 'google_play',
    tmdbId: 3,
    label: '구글 플레이 무비',
    logo: '/images/googleplay_logo.jpg',
  },
  { id: 'naver_series_on', tmdbId: 111, label: '네이버 시리즈온' },
  {
    id: 'coupang_play',
    tmdbId: 350,
    label: '쿠팡플레이',
    logo: '/images/coupangplay_logo.png',
  },
  { id: 'youtube', tmdbId: 192, label: '유튜브' },
];

export function getProviderIdsFromKeys(keys = []) {
  return OTT_PROVIDERS.filter((p) => keys.includes(p.id)).map((p) => p.tmdbId);
}
