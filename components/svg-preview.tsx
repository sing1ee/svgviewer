"use client";

import { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface SvgPreviewProps {
  svgCode: string;
  zoom: number;
}

export default function SvgPreview({ svgCode, zoom }: SvgPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

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
      svgElement.style.transform = `scale(${zoom / 100})`;
      svgElement.style.transformOrigin = 'center';
      svgElement.style.transition = 'transform 0.2s ease-out';
      
      // Add drop shadow for better visibility
      svgElement.style.filter = 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.1))';
      
      // Append to container
      containerRef.current.appendChild(svgElement);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [svgCode, zoom]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div 
        ref={containerRef} 
        className="flex items-center justify-center w-full h-full overflow-auto p-4"
      ></div>
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="bg-destructive/10 border border-destructive text-destructive p-6 rounded-lg max-w-md text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-bold text-lg mb-1">SVG Parsing Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}