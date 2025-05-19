// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import PageLayout from '../components/PageLayout';
import { UserPlus, CheckCircle } from 'lucide-react'; // CheckCircle 아이콘 추가

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  // const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가 (선택 사항)
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    // setIsLoading(true); // 로딩 시작

    if (pw.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      // setIsLoading(false); // 로딩 끝
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, pw);
      await signOut(auth); // 회원가입 후 자동 로그아웃 (보안상 권장)

      // alert 대신 navigate의 state를 사용하여 성공 메시지 전달
      navigate('/login', {
        state: {
          successMessage: '성공적으로 회원가입 되었습니다. 로그인해주세요!',
          fromSignUp: true // 로그인 페이지에서 특정 UI를 보여주기 위한 플래그 (선택 사항)
        }
      });
    } catch (err) {
      console.error("회원가입 오류:", err.code, err.message);
      let friendlyMessage = '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.';
      switch (err.code) {
        case 'auth/email-already-in-use':
          friendlyMessage = '이미 사용 중인 이메일 주소입니다.';
          break;
        case 'auth/invalid-email':
          friendlyMessage = '유효하지 않은 이메일 주소 형식입니다.';
          break;
        case 'auth/weak-password':
          friendlyMessage = '비밀번호가 너무 약합니다. 더 강력한 비밀번호를 사용해주세요.';
          break;
      }
      setError(friendlyMessage);
    } finally {
      // setIsLoading(false); // 로딩 끝
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 md:p-10 space-y-6">
          <div className="text-center">
            <UserPlus size={48} className="mx-auto text-green-600 dark:text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">회원가입</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              GameInfo 커뮤니티에 오신 것을 환영합니다!
            </p>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm" role="alert">
              {error}
            </div>
          )}
          {/* 성공 메시지는 로그인 페이지에서 표시합니다. */}

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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                비밀번호 (6자 이상)
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={pw}
                onChange={e => setPw(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            <button
              type="submit"
              // disabled={isLoading} // 로딩 상태 사용 시
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out"
            >
              {/* {isLoading ? '가입 중...' : '계정 만들기'} */}
              계정 만들기
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 hover:underline">
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}