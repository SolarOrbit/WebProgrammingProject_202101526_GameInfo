// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // useLocation 임포트
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../contexts/AuthContext';
import PageLayout from '../components/PageLayout';
import { LogIn, CheckCircle } from 'lucide-react'; // CheckCircle 아이콘 임포트

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  // const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가 (선택 사항)
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // location 객체 가져오기

  // SignUp 페이지에서 전달된 성공 메시지
  const successMessageFromSignUp = location.state?.successMessage;
  // 메시지를 한 번만 보여주기 위해 상태로 관리하거나, useEffect로 location.state 초기화
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(successMessageFromSignUp);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  // 성공 메시지가 표시된 후, 페이지 리로드나 다른 경로 이동 시 다시 보이지 않도록 처리
  useEffect(() => {
    if (location.state?.successMessage) {
      // 현재 location.state를 유지하면서 successMessage만 제거하거나,
      // navigate로 현재 경로를 다시 호출하면서 state를 비워줄 수 있습니다.
      // 간단하게는, 한 번 표시 후 상태를 초기화합니다.
      const timer = setTimeout(() => {
        setDisplaySuccessMessage(null); // 몇 초 후 메시지 숨김 (선택 사항)
        // 또는, navigate(location.pathname, { replace: true, state: {} }) 로 state를 명시적으로 제거
      }, 5000); // 5초 후 메시지 자동 숨김 (예시)
      return () => clearTimeout(timer);
    }
  }, [location.state]);


  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setDisplaySuccessMessage(null); // 로그인 시도 시 기존 성공 메시지 제거
    // setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pw);
    } catch (err) {
      console.error("로그인 오류:", err.code, err.message);
      let friendlyMessage = '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.';
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          friendlyMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
          break;
        case 'auth/invalid-email':
          friendlyMessage = '유효하지 않은 이메일 주소 형식입니다.';
          break;
        case 'auth/user-disabled':
          friendlyMessage = '사용 중지된 계정입니다. 관리자에게 문의하세요.';
          break;
        case 'auth/too-many-requests':
          friendlyMessage = '너무 많은 로그인 시도를 하셨습니다. 잠시 후 다시 시도해주세요.';
          break;
      }
      setError(friendlyMessage);
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 md:p-10 space-y-6">
          <div className="text-center">
            <LogIn size={48} className="mx-auto text-blue-600 dark:text-blue-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">환영합니다!</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              로그인하여 게임 즐겨찾기와 리뷰를 확인하세요.
            </p>
          </div>

          {/* 회원가입 성공 메시지 표시 */}
          {displaySuccessMessage && (
            <div className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 dark:border-green-600 text-green-700 dark:text-green-300 p-4 rounded-md shadow-sm" role="alert">
              <div className="flex">
                <div className="py-1"><CheckCircle size={20} className="mr-3 text-green-500" /></div>
                <div>
                  <p className="font-semibold">회원가입 완료!</p>
                  <p className="text-sm">{displaySuccessMessage}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 p-4 rounded-md shadow-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* ... (이메일, 비밀번호 입력 필드 및 로그인 버튼은 이전과 동일) ... */}
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
            </div>
            <button
              type="submit"
              // disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out"
            >
              {/* {isLoading ? '로그인 중...' : '로그인'} */}
              로그인
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            아직 계정이 없으신가요?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
              회원가입하기
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}