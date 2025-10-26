
import React, { useEffect } from "react";

export default function Layout({ children, currentPageName }) {
  useEffect(() => {
    // Remove loading class after everything loads
    document.body.classList.add('loaded');
  }, []);

  return (
    <div className="aetheria-layout">
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Orbitron', monospace;
          background: #000000 !important;
          overflow-x: hidden;
        }
        
        .aetheria-layout {
          min-height: 100vh;
          background: #000000;
          color: white;
        }
        
        * {
          box-sizing: border-box;
        }
        
        canvas {
          display: block;
        }
      `}</style>
      
      {/* Critical Meta Tags for Dark Loading */}
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {children}
    </div>
  );
}
