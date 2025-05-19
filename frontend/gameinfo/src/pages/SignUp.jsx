// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link 컴포넌트 임포트
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import PageLayout from '../components/PageLayout'; // PageLayout 임포트
import { UserPlus } from 'lucide-react'; // 아이콘 임포트 (예시)

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState(''); // 에러 메시지 상태 추가
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    setError(''); // 이전 에러 초기화
    if (pw.length < 6) { // 간단한 비밀번호 길이 유효성 검사
        setError('Password should be at least 6 characters long.');
        return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, pw);
      await signOut(auth); // 회원가입 후 자동 로그아웃
      alert('Sign up successful! Please login.'); // 성공 메시지
      navigate('/login');
    } catch (err) {
      console.error("Sign up error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      }
       else {
        setError('Failed to sign up. Please try again later.');
      }
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 md:p-10 space-y-6">
          <div className="text-center">
            <UserPlus size={48} className="mx-auto text-green-600 dark:text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">계정을 생성하세요</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              커뮤니티에 가입하여 게임을 발견하고 리뷰해 보세요!
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                비밀번호 (최소 6자 이상)
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
            {/* TODO: 비밀번호 확인 필드 추가 권장 */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out"
            >
              계정 생성
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 hover:underline">
              여기서 로그인하세요.
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}