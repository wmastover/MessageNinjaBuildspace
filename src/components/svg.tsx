import React from 'react';

interface MySvgIconProps {
  size?: string;
}

export const MySvgIcon: React.FC<MySvgIconProps> = ({ size = '1080' }) => (
    <svg viewBox="0 0 1080 1200" width={size} height={size}>
        <path d="M81.4,613.9c0-253.3,205.3-458.6,458.6-458.6s458.6,205.3,458.6,458.6" />
        <polygon points="540,918.7 81.4,613.9 81.4,1080 998.6,1080 998.6,613.9" />
        <circle cx="370.8" cy="613.9" r="76.5" />
        <circle cx="709.2" cy="613.9" r="76.5" />
    </svg>
);

// export default MySvgIcon;
