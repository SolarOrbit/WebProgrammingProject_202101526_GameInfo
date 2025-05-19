// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link 컴포넌트 임포트
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../contexts/AuthContext';
import PageLayout from '../components/PageLayout'; // PageLayout 임포트
import { LogIn } from 'lucide-react'; // 아이콘 임포트 (예시)

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState(''); // 에러 메시지 상태 추가
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const onSubmit = async e => {
    e.preventDefault();
    setError(''); // 이전 에러 메시지 초기화
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      // 성공 시 AuthContext의 user 상태 변경으로 useEffect에서 자동 리디렉션됨
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to login. Please try again later.');
      }
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4"> {/* 헤더/푸터 높이 고려하여 수직 중앙 정렬 */}
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 md:p-10 space-y-6">
          <div className="text-center">
            <LogIn size={48} className="mx-auto text-blue-600 dark:text-blue-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">환영합니다!</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              게임 즐겨찾기 및 리뷰에 접근하려면 로그인하세요.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                이메일 주소
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={pw}
                onChange={e => setPw(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
              {/* <div className="text-right mt-1">
                <a href="#" className="text-xs text-blue-600 hover:underline dark:text-blue-400">Forgot password?</a>
              </div> */}
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out"
            >
              로그인
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            계정이 아직 없으신가요?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
              여기서 가입하세요
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}