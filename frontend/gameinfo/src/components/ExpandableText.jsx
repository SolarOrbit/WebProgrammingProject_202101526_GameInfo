// src/components/ExpandableText.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ExpandableText({ text, maxLength = 300, className = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return <p className={`text-gray-500 dark:text-gray-400 ${className}`}>N/A</p>;
  }

  const needsTruncation = text.length > maxLength;
  // 아래 줄의 'constdisplayText'를 'const displayText'로 수정합니다. (const와 displayText 사이 공백 추가)
  const displayText = isExpanded || !needsTruncation ? text : `${text.substring(0, maxLength)}...`;

  const renderTextWithLineBreaks = (inputText) => {
    return inputText.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`text-gray-700 dark:text-gray-300 ${className}`}>
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
        {renderTextWithLineBreaks(displayText)}
      </div>
      {needsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={18} className="mr-1" /> 접기
            </>
          ) : (
            <>
              <ChevronDown size={18} className="mr-1" /> 더 보기
            </>
          )}
        </button>
      )}
    </div>
  );
}