// src/pages/SignUp.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase'


export default function SignUp() {
  const [email, setEmail] = useState('')
  const [pw, setPw]       = useState('')
  const navigate          = useNavigate()

  const onSubmit = async e => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, pw)
      await signOut(auth) // 회원가입 후 자동 로그아웃
      alert('회원가입 성공! 로그인 페이지로 이동합니다.')
      navigate('/login')
    } catch (err) {
      alert('회원가입 실패: ' + err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Sign Up</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  )
}
