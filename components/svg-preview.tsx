"use client";

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, X, Maximize2 } from 'lucide-react';

interface SvgPreviewProps {
  svgCode: string;
  zoom: number;
}

export default function SvgPreview({ svgCode, zoom }: SvgPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous content and errors
    containerRef.current.innerHTML = '';
    setError(null);
    
    try {
      // Parse SVG code
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');
      
      // Check for parsing errors
      const parserError = svgDoc.querySelector('parsererror');
      if (parserError) {
        setError(parserError.textContent || 'SVG parsing error');
        return;
      }
      
      // Get the SVG element
      const svgElement = svgDoc.documentElement;
      
      // Apply zoom and smooth transitions
      svgElement.style.transform = `scale(${zoom / 100}) translate(${position.x}px, ${position.y}px)`;
      svgElement.style.transformOrigin = 'center';
      svgElement.style.transition = 'transform 0.2s ease-out';
      
      // Add drop shadow for better visibility
      svgElement.style.filter = 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.1))';
      
      // 确保SVG元素可以正确显示，不会被容器限制
      svgElement.style.maxWidth = 'none';
      svgElement.style.maxHeight = 'none';
      
      // Append to container
      containerRef.current.appendChild(svgElement);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [svgCode, zoom, position]);

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setStartPos({ 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault(); // Prevent scrolling while dragging
    setPosition({
      x: e.touches[0].clientX - startPos.x,
      y: e.touches[0].clientY - startPos.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Double tap/click to reset position
  const handleDoubleClick = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div 
        ref={containerRef} 
        className={`w-full h-full overflow-auto p-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ 
          display: 'block', // 改为block布局，避免flex布局对滚动条的影响
          position: 'relative',
          touchAction: 'none' // Disable browser handling of all panning and zooming gestures
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
      ></div>
      
      {/* Mobile instructions tooltip */}
      <div className="absolute bottom-4 left-4 right-4 md:hidden bg-black/70 text-white text-xs p-2 rounded-md backdrop-blur-sm text-center pointer-events-none opacity-70">
        Drag to move • Double tap to reset position
      </div>
      
      {/* fullscreen button */}
      <button
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors z-10"
        onClick={handleToggleFullscreen}
        aria-label="Fullscreen"
        title="Fullscreen"
      >
        <Maximize2 className="h-5 w-5" />
      </button>
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="bg-destructive/10 border border-destructive text-destructive p-6 rounded-lg max-w-md text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-bold text-lg mb-1">SVG Parsing Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={handleToggleFullscreen}
        >
          <div 
            className="relative bg-white dark:bg-gray-900 rounded-lg w-full h-full max-w-[90vw] max-h-[90vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              onClick={handleToggleFullscreen}
              aria-label="Close fullscreen preview"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div 
              className={`w-full h-full flex items-center justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={handleDoubleClick}
              style={{ touchAction: 'none' }}
            >
              {svgCode && (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: svgCode 
                  }} 
                  style={{ 
                    transform: `scale(${zoom / 100}) translate(${position.x}px, ${position.y}px)`,
                    transformOrigin: 'center',
                    transition: 'transform 0.2s ease-out',
                    filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.1))'
                  }}
                />
              )}
            </div>
            
            {/* Mobile instructions tooltip in fullscreen */}
            <div className="absolute bottom-4 left-4 right-4 md:hidden bg-black/70 text-white text-xs p-2 rounded-md backdrop-blur-sm text-center pointer-events-none opacity-70">
              Drag to move • Double tap to reset position
            </div>
          </div>
        </div>
      )}
    </div>
  );
}