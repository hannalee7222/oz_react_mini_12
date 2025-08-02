[mission4] 4단계 미션 구현 - 이한나/개인

## 구현 사항

- AuthForm 컴포넌트 생성 및 스타일링 적용
- SignupPage와 LoginPage에서 입력 필드 유효성 검사 추가
- Supabase 인증 연동: 회원가입 및 로그인 기능 구현
- 로그인 여부에 따라 NavBar UI 조건부 렌더링
- 사용자 정보 전역 상태로 관리 (Context + localStorage)

## 어려웠던 점

- 유효성 검사 기능 구현에서 입력한 로직이 반영되지 않고 브라우저 기본 유효성 검사만 이루어져서 많이 헤맸다. 알고보니 noValidate를 추가해야 내가 만든 커스텀 로직이 실행된다는 것을 알았다.

- 기본 제공되는 코드를 보지 않고 스스로 찾아내고 싶어서 시간이 많이 걸렸다. 인터넷의 도움을 많이 받아서 온전히 내 힘으로 작성한 코드라고 할 순 없지만, 그래도 노력을 많이 해서 얻은 결과라서 만족스럽다.

## 구현 이미지

<img src="https://raw.githubusercontent.com/hannalee7222/oz_react_mini_12/f478aeaf73c33b626d7f8205f52bd4f89f2c440b/movie-info/public/images/4%EC%9D%BC%EC%B0%A8_Login%2CSignup.png" alt="LoginPage/SignupPage" width="500" />
<img src="https://raw.githubusercontent.com/hannalee7222/oz_react_mini_12/f478aeaf73c33b626d7f8205f52bd4f89f2c440b/movie-info/public/images/4%EC%9D%BC%EC%B0%A8_kakaoLogin.png" alt="kakaoLoginPage" width="500" />
<video controls width="500">
  <source src="movie-info/public/images/NavBarDropdown.mov" type="video/quicktime" />
</video>
