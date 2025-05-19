// frontend/gameinfo/tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class', // 다크 모드 설정 유지
  theme: {
    extend: {
      colors: {
        // 예시 색상 팔레트 (실제 프로젝트에 맞게 수정하세요)
        'brand-primary': { // 주조색 (예: 파란색 계열)
          light: '#60A5FA', // 기본보다 밝은 톤 (호버 등)
          DEFAULT: '#3B82F6', // 기본
          dark: '#2563EB',  // 기본보다 어두운 톤 (액티브 등)
        },
        'brand-secondary': { // 보조색 (예: 청록색 계열)
          light: '#5EEAD4',
          DEFAULT: '#2DD4BF',
          dark: '#14B8A6',
        },
        'brand-accent': { // 강조색 (예: 주황색 또는 노란색 계열)
          light: '#FBBF24',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        'neutral': { // 중립색 (회색 계열)
          50: '#F9FAFB', // 매우 밝은 회색 (배경 등)
          100: '#F3F4F6',
          200: '#E5E7EB', // 테두리 등
          300: '#D1D5DB',
          400: '#9CA3AF', // 부가 텍스트 등
          500: '#6B7280',
          600: '#4B5563', // 본문 텍스트 (다크모드)
          700: '#374151', // 카드 배경 (다크모드)
          800: '#1F2937', // 페이지 배경 (다크모드)
          900: '#111827', // 매우 어두운 회색
        },
        // 기존 Tailwind 색상은 그대로 사용 가능하며, 필요시 여기서 덮어쓰거나 추가합니다.
        // 예: 'steam-blue': '#1b2838',
      },
      fontFamily: {
        // 폰트는 다음 단계에서 정의합니다.
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'], // 기본 폰트 예시
        headings: ['Montserrat', 'sans-serif'], // 제목용 폰트 예시
      },
      // 그림자, 간격 등 다른 테마 요소도 여기서 확장 가능합니다.
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', 'system-ui', 'sans-serif'], // 따옴표로 묶어주세요 (공백 포함 시)
        headings: ['Orbitron', '"Noto Sans KR"', 'sans-serif'], // 제목용 폰트
        // 필요에 따라 더 많은 폰트 그룹 정의 가능
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // 이미 있다면 유지
  ],
}