import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth }                        from '../firebase'
import { AuthContext }                 from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [pw, setPw]       = useState('')
  const { user }          = useContext(AuthContext)
  const navigate          = useNavigate()

  useEffect(() => {
    if (user) navigate('/')
  }, [user])

  const onSubmit = async e => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, pw)
    } catch (err) {
      alert('로그인 실패: ' + err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Login</h1>
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
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center">
         계정이 없으신가요?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            회원가입
         </a>
      </p>
    </div>
  )
}
