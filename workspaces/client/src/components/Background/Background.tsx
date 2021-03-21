import React, { FC, ReactNode } from 'react';
import './Background.css';

interface IBackgroundProps {
  children: ReactNode;
}

const Background: FC<IBackgroundProps> = ({ children }) => {
  return (
    <div className="background">
      <div className="border border-white border-opacity-20 text-gray-darkest p-2 w-full h-full bg-white bg-opacity-40 backdrop-filter-blur">
        {children}
      </div>
    </div>
  );
};

export default Background;
