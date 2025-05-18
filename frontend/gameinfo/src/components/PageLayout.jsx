// src/components/PageLayout.jsx
export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* max-w-6xl, mx-auto로 중앙 정렬, px로 좌우 여백 */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  )
}
