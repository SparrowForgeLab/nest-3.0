import React, { useState, useEffect } from 'react';

export default function RenderIcon({ icon, defaultIcon = '⭐', className = 'w-5 h-5 object-contain' }) {
  const [hasError, setHasError] = useState(false);
  const iconStr = icon ? icon.trim() : '';

  // Reset error state whenever the icon prop changes so newly updated URLs render properly
  useEffect(() => {
    setHasError(false);
  }, [iconStr]);

  if (!iconStr) {
    return <span className="text-lg leading-none">{defaultIcon}</span>;
  }

  const isImg = iconStr.startsWith('http://') || iconStr.startsWith('https://') || iconStr.startsWith('data:') || iconStr.startsWith('/');

  if (isImg && !hasError) {
    return (
      <img
        src={iconStr}
        alt="icon"
        className={className}
        onError={() => setHasError(true)}
      />
    );
  }

  return <span className="text-lg leading-none">{hasError ? defaultIcon : iconStr}</span>;
}
