
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showText?: boolean;
  onClick?: () => void;
}

export function Logo({
  className,
  size = "md",
  showText = true
}: LogoProps) {
  // Ensure that size is a valid key that exists in the sizes object
  const validSize = size && ["xs", "sm", "md", "lg"].includes(size) ? size : "md";
  
  const sizes = {
    xs: {
      logoSize: "h-24 w-28", // Increased width from w-24
      containerSize: "h-24",
      titleSize: "32",
      subtitleSize: "16"
    },
    sm: {
      logoSize: "h-32 w-36", // Increased width from w-32
      containerSize: "h-32",
      titleSize: "40",
      subtitleSize: "20"
    },
    md: {
      logoSize: "h-48 w-52", // Increased width from w-48
      containerSize: "h-48",
      titleSize: "56",
      subtitleSize: "28"
    },
    lg: {
      logoSize: "h-64 w-72", // Increased width from w-64
      containerSize: "h-64",
      titleSize: "64",
      subtitleSize: "32"
    }
  };
  
  const {
    logoSize,
    containerSize,
    titleSize,
    subtitleSize
  } = sizes[validSize];
  
  return <div className={cn(`flex items-center gap-3`, className)}>
      {/* SVG Logo with embedded text */}
      <div className={cn("relative", logoSize)}>
        <svg viewBox="0 0 440 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Brain in the middle */}
          <g transform="translate(150, 60) scale(0.8)">
            {/* Brain outline */}
            <path d="M60,0 C26.9,0 0,26.9 0,60 C0,93.1 26.9,120 60,120 C93.1,120 120,93.1 120,60 C120,26.9 93.1,0 60,0 Z" fill="#16425B" stroke="#1B2432" strokeWidth="6" />
            
            {/* Left half of brain */}
            <path d="M60,5 C35,5 10,30 10,60 C10,90 35,115 60,115 L60,5 Z" fill="#7AE582" stroke="#1B2432" strokeWidth="0" />
            
            {/* Right half of brain */}
            <path d="M60,5 C85,5 110,30 110,60 C110,90 85,115 60,115 L60,5 Z" fill="#33C3F0" stroke="#1B2432" strokeWidth="0" />
            
            {/* Circuit nodes and connections - left */}
            <circle cx="25" cy="30" r="6" fill="#1B2432" stroke="white" strokeWidth="2" />
            <circle cx="25" cy="60" r="6" fill="#1B2432" stroke="white" strokeWidth="2" />
            <circle cx="25" cy="90" r="6" fill="#1B2432" stroke="white" strokeWidth="2" />
            <circle cx="45" cy="45" r="6" fill="#1B2432" stroke="white" strokeWidth="2" />
            <circle cx="45" cy="75" r="6" fill="#1B2432" stroke="white" strokeWidth="2" />
            
            <line x1="25" y1="30" x2="45" y2="45" stroke="#1B2432" strokeWidth="3" />
            <line x1="25" y1="60" x2="45" y2="45" stroke="#1B2432" strokeWidth="3" />
            <line x1="25" y1="60" x2="45" y2="75" stroke="#1B2432" strokeWidth="3" />
            <line x1="25" y1="90" x2="45" y2="75" stroke="#1B2432" strokeWidth="3" />
            
            {/* Circuit nodes and connections - right */}
            <circle cx="95" cy="30" r="6" fill="#1B2432" stroke="white" strokeWidth="2" />
            <circle cx="95" cy="60" r="6" fill="#1B2432" stroke="white" strokeWidth="2" />
            <circle cx="95" cy="90" r="6" fill="#1B2432" stroke="white" strokeWidth="2" />
            <circle cx="75" cy="45" r="6" fill="#1B2432" stroke="white" strokeWidth="2" />
            <circle cx="75" cy="75" r="6" fill="#1B2432" stroke="white" strokeWidth="2" />
            
            <line x1="95" y1="30" x2="75" y2="45" stroke="#1B2432" strokeWidth="3" />
            <line x1="95" y1="60" x2="75" y2="45" stroke="#1B2432" strokeWidth="3" />
            <line x1="95" y1="60" x2="75" y2="75" stroke="#1B2432" strokeWidth="3" />
            <line x1="95" y1="90" x2="75" y2="75" stroke="#1B2432" strokeWidth="3" />
            
            {/* Center divider */}
            <line x1="60" y1="5" x2="60" y2="115" stroke="#1B2432" strokeWidth="3" />
          </g>
          
          {/* Left Bridge */}
          <g transform="translate(30, 90) scale(0.7)">
            <path d="M0,30 L100,30" stroke="#1B2432" strokeWidth="5" />
            <path d="M0,0 C25,0 25,30 50,30 C75,30 75,0 100,0" stroke="#1B2432" strokeWidth="5" fill="none" />
            <line x1="20" y1="0" x2="20" y2="30" stroke="#1B2432" strokeWidth="5" />
            <line x1="50" y1="0" x2="50" y2="30" stroke="#1B2432" strokeWidth="5" />
            <line x1="80" y1="0" x2="80" y2="30" stroke="#1B2432" strokeWidth="5" />
          </g>
          
          {/* Right Bridge */}
          <g transform="translate(270, 90) scale(0.7)">
            <path d="M0,30 L100,30" stroke="#1B2432" strokeWidth="5" />
            <path d="M0,0 C25,0 25,30 50,30 C75,30 75,0 100,0" stroke="#1B2432" strokeWidth="5" fill="none" />
            <line x1="20" y1="0" x2="20" y2="30" stroke="#1B2432" strokeWidth="5" />
            <line x1="50" y1="0" x2="50" y2="30" stroke="#1B2432" strokeWidth="5" />
            <line x1="80" y1="0" x2="80" y2="30" stroke="#1B2432" strokeWidth="5" />
          </g>
          
          {/* Waves under both bridges */}
          <g transform="translate(30, 140) scale(0.7)">
            <path d="M0,0 C15,-10 35,10 50,0 C65,-10 85,10 100,0" stroke="#33C3F0" strokeWidth="4" fill="none" />
            <path d="M0,10 C15,0 35,20 50,10 C65,0 85,20 100,10" stroke="#7AE582" strokeWidth="4" fill="none" />
          </g>
          
          <g transform="translate(270, 140) scale(0.7)">
            <path d="M0,0 C15,-10 35,10 50,0 C65,-10 85,10 100,0" stroke="#33C3F0" strokeWidth="4" fill="none" />
            <path d="M0,10 C15,0 35,20 50,10 C65,0 85,20 100,10" stroke="#7AE582" strokeWidth="4" fill="none" />
          </g>
          
          {/* BrainBridge text - directly in SVG with larger font sizes */}
          {showText && (
            <>
              <text x="220" y="210" textAnchor="middle" fontWeight="bold" fill="#1B2432" fontSize={titleSize}>
                BrainBridge
              </text>
              <text x="220" y="250" textAnchor="middle" fontSize={subtitleSize} fill="#1B2432">
                Crossing the Bridge to Focus
              </text>
            </>
          )}
        </svg>
      </div>
    </div>;
}
