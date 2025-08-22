
import React from 'react';

const HeroPattern: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <svg
        className="absolute top-0 left-0 transform -translate-y-20 opacity-10"
        width="600"
        height="600"
        fill="none"
        viewBox="0 0 600 600"
      >
        <path
          fill="currentColor"
          d="M0 0h600v600H0z"
        />
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M300 300c82.843 0 150-67.157 150-150S382.843 0 300 0 150 67.157 150 150s67.157 150 150 150zm0 0c-82.843 0-150 67.157-150 150s67.157 150 150 150 150-67.157 150-150-67.157-150-150-150z"
          clipRule="evenodd"
        />
      </svg>
      <svg
        className="absolute bottom-0 right-0 transform translate-y-20 opacity-10"
        width="600"
        height="600"
        fill="none"
        viewBox="0 0 600 600"
      >
        <path
          fill="currentColor"
          d="M600 600H0V0h600z"
        />
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M300 300c82.843 0 150-67.157 150-150S382.843 0 300 0 150 67.157 150 150s67.157 150 150 150zm0 0c-82.843 0-150 67.157-150 150s67.157 150 150 150 150-67.157 150-150-67.157-150-150-150z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default HeroPattern;
