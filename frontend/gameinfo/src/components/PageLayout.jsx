// src/components/PageLayout.jsx
import React from 'react'

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 최대 너비를 screen-xl로 확장하여 더 많은 카드가 한 줄에 표시되도록 함 */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  )
}
