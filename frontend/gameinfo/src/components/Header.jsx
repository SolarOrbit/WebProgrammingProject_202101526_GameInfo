// src/components/Header.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar'; // SearchBar 스타일도 함께 개선하는 것이 좋습니다.
import { AuthContext } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Sun, Moon, Heart, LogIn, LogOut, UserCircle, Gamepad2 } from 'lucide-react'; // 아이콘 추가
//import Button from './ui/Button.jsx'; // 만약 Button 컴포넌트를 만들었다면 사용

export default function Header({ onSearch }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    // 초기 테마 설정 (localStorage 우선)
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') return true;
      if (storedTheme === 'light') return false;
      // localStorage에 없으면 시스템 설정 따름 (선택적)
      // return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // 기본값은 라이트 모드
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // 로그아웃 후 로그인 페이지로
    } catch (err) {
      console.error('로그아웃 실패:', err);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    // 헤더 배경 및 하단 구분선/그림자 추가
    <header className="bg-white dark:bg-neutral-800 shadow-md sticky top-0 z-50"> {/* sticky top-0 z-50: 스크롤 시 상단 고정 */}
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20"> {/* 높이 조절 */}
        {/* 로고 */}
        <Link
          to="/"
          className="flex items-center text-2xl sm:text-3xl font-headings font-bold text-brand-primary dark:text-brand-primary-light hover:opacity-80 transition-opacity"
          aria-label="GameInfo 홈으로"
        >
          <Gamepad2 size={32} className="mr-2" /> {/* 예시 로고 아이콘 */}
          GameInfo
        </Link>

        {/* 검색창 (가운데 정렬을 위해 flex-grow 사용, 필요시 너비 제한) */}
        <div className="flex-1 max-w-xl mx-4 hidden sm:block"> {/* 모바일에서는 숨김 처리 (선택적) */}
          <SearchBar onSearch={onSearch} />
        </div>

        {/* 오른쪽 아이콘 및 버튼 그룹 */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* 다크 모드 토글 버튼 */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-colors"
            aria-label={isDark ? "라이트 모드 전환" : "다크 모드 전환"}
            title={isDark ? "라이트 모드" : "다크 모드"}
          >
            {isDark
              ? <Sun size={22} className="text-yellow-400" />
              : <Moon size={22} />
            }
          </button>

          {/* 즐겨찾기 링크 (로그인 시에만 표시) */}
          {user && (
            <Link
              to="/favorites"
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-colors"
              aria-label="즐겨찾기 목록"
              title="즐겨찾기"
            >
              <Heart size={22} className="hover:text-red-500 dark:hover:text-red-400" />
            </Link>
          )}

          {/* 사용자 정보 및 인증 */}
          {user ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link to="/profile" aria-label="마이페이지" title={user.email || "마이페이지"} className="flex items-center text-sm text-neutral-700 dark:text-neutral-300 hover:text-brand-primary dark:hover:text-brand-primary-light">
                 {/* user.photoURL이 있다면 이미지 표시, 없다면 아이콘 표시 */}
                {user.photoURL ? (
                    <img src={user.photoURL} alt="프로필" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full mr-2 border-2 border-transparent hover:border-brand-primary"/>
                ) : (
                    <UserCircle size={22} className="mr-1 sm:mr-2" />
                )}
                <span className="hidden md:inline">{user.email?.split('@')[0]} 님</span> {/* 이메일 아이디만 표시 */}
              </Link>
              {/* <Button variant="danger" size="sm" onClick={handleLogout}>로그아웃</Button> */}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-neutral-800 transition-colors"
                aria-label="로그아웃"
              >
                <LogOut size={16} className="sm:hidden" /> {/* 작은 화면에서는 아이콘만 */}
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          ) : (
            // <Button variant="primary" size="sm" onClick={() => navigate('/login')}>로그인</Button>
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-neutral-800 transition-colors"
              aria-label="로그인"
            >
              <LogIn size={16} className="sm:hidden"/> {/* 작은 화면에서는 아이콘만 */}
              <span className="hidden sm:inline">로그인</span>
            </button>
          )}
        </div>
      </div>
      {/* 모바일용 검색창 (선택적) */}
      <div className="sm:hidden px-4 pb-3">
        <SearchBar onSearch={onSearch} />
      </div>
    </header>
  );
}