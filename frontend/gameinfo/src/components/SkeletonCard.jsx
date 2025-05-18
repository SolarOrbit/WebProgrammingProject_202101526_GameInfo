// src/components/SkeletonCard.jsx
import React from 'react'

export default function SkeletonCard() {
  return (
    <div className="animate-pulse flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden w-full max-w-xs">
      {/* 이미지 자리 */}
      <div className="relative w-full pb-[75%] bg-gray-300 dark:bg-gray-700"></div>
      {/* 텍스트 자리 */}
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
    </div>
  )
}
