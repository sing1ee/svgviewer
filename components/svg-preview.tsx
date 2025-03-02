"use client";

import { useEffect, useRef } from 'react';

interface SvgPreviewProps {
  svgCode: string;
  width: number;
  height: number;
  zoom: number;
}

export default function SvgPreview({ svgCode, width, height, zoom }: SvgPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous content
    containerRef.current.innerHTML = '';
    
    try {
      // Parse SVG code
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');
      
      // Check for parsing errors
      const parserError = svgDoc.querySelector('parsererror');
      if (parserError) {
        containerRef.current.innerHTML = `
          <div class="text-red-500 p-4">
            <p class="font-bold">SVG Parsing Error:</p>
            <p>${parserError.textContent}</p>
          </div>
        `;
        return;
      }
      
      // Get the SVG element
      const svgElement = svgDoc.documentElement;
      
      // Set width and height if specified
      if (width) svgElement.setAttribute('width', width.toString());
      if (height) svgElement.setAttribute('height', height.toString());
      
      // Apply zoom
      svgElement.style.transform = `scale(${zoom / 100})`;
      svgElement.style.transformOrigin = 'center';
      
      // Append to container
      containerRef.current.appendChild(svgElement);
    } catch (error) {
      containerRef.current.innerHTML = `
        <div class="text-red-500 p-4">
          <p class="font-bold">Error:</p>
          <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      `;
    }
  }, [svgCode, width, height, zoom]);

  return (
    <div ref={containerRef} className="flex items-center justify-center w-full h-full"></div>
  );
}