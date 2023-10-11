import React from 'react';

interface MySvgIconProps {
    size?: string;
  }

export const SvgLoadedComponent: React.FC<MySvgIconProps> = ({ size = '1080' }) => (
    <svg xmlns="http://www.w3.org/2000/svg"  width={size} height={size} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 1080 1080" xmlSpace="preserve" transform="rotate(-90 540 540)">
        
        <path d="M81.4,613.9c0-253.3,205.3-458.6,458.6-458.6s458.6,205.3,458.6,458.6" />
        <g>
            <g>
                <polygon points="540,918.7 81.4,613.9 81.4,1080 998.6,1080 998.6,613.9" />
            </g>
        </g>
        <g>
            <circle cx="370.8" cy="613.9" r="76.5" />
            <circle cx="709.2" cy="613.9" r="76.5" />
        </g>
    </svg>
);

