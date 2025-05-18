// src/components/Header.jsx
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
import { AuthContext } from '../contexts/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { Star, Heart, Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Header({ onSearch }) {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
  }, [])

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
    setIsDark(prev => !prev)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (err) {
      console.error('로그아웃 실패:', err)
      alert('로그아웃 중 오류가 발생했습니다.')
    }
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* 로고 */}
        <Link to="/" className="text-2xl font-bold text-gray-800">GameInfo</Link>

        {/* 검색창 */}
        <div className="flex-1 mx-4">
          <SearchBar onSearch={onSearch} />
        </div>

        <div className="flex items-center space-x-4">
          {/* 다크 모드 토글 버튼 */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle Dark Mode"
          >
            {isDark
              ? <Sun className="text-yellow-400" size={20} />
              : <Moon className="text-gray-800" size={20} />
            }
          </button>
        </div>

        {/* 네비게이션: 즐겨찾기, 로그인/로그아웃 */}
        <div className="flex items-center space-x-4">
          {/* 즐겨찾기 링크 */}
          {user && (
            <Link to="/favorites" className="p-2 rounded-full hover:bg-gray-100" aria-label="Favorites">
              <Heart size={24} className="text-gray-800" />
            </Link>
          )}

          {user ? (
            <>            
              <span className="text-gray-800 text-sm">안녕하세요, {user.email}님</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
