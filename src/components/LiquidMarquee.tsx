import React from 'react';

export const LiquidMarquee: React.FC = () => {
  return (
    <>
      <svg width="0" height="0">
        <defs>
          <filter id="liquidFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves="1" result="noise">
              <animate attributeName="baseFrequency" dur="20s" values="0.01 0.03; 0.02 0.06; 0.01 0.03" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
          </filter>
        </defs>
      </svg>

      <style>{`
        .liquid-text {
          filter: url('#liquidFilter');
          display: inline-block;
          font-family: 'IBM Plex Sans', sans-serif;
          font-weight: 600;
          color: #0e2b1c;
          letter-spacing: 0.05em;
        }
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
          background: #dbe4dd;
          padding: 1.2rem 0;
          border-top: 1px solid #c7d5cb;
          border-bottom: 1px solid #c7d5cb;
        }
        .marquee-content {
          display: inline-block;
          animation: marquee 35s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
      `}</style>

      <div className="marquee-container">
        <div className="marquee-content liquid-text">
          RIO POMBA · DADOS ABERTOS · PRESERVAÇÃO AMBIENTAL · BIOINDICADORES · RIO POMBA · DADOS ABERTOS · PRESERVAÇÃO AMBIENTAL · BIOINDICADORES
        </div>
      </div>
    </>
  );
};
