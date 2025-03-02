"use client";

import { useEffect, useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!editorRef.current || !textareaRef.current) return;

    const highlightSyntax = (code: string) => {
      // Simple syntax highlighting for SVG
      return code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/(".*?")/g, '<span style="color: #a5d6ff;">$1</span>')
        .replace(/(&lt;\/?[a-z0-9]+)/gi, '<span style="color: #ff7b72;">$1</span>')
        .replace(/([a-z0-9\-]+)=/gi, '<span style="color: #d2a8ff;">$1</span>=');
    };

    const updateHighlighting = () => {
      if (!editorRef.current || !textareaRef.current) return;
      
      const code = textareaRef.current.value;
      editorRef.current.innerHTML = highlightSyntax(code);
      
      // Add line numbers
      const lines = code.split('\n');
      const lineNumbers = document.createElement('div');
      lineNumbers.className = 'line-numbers';
      lineNumbers.innerHTML = lines.map((_, i) => `<span>${i + 1}</span>`).join('');
      
      editorRef.current.innerHTML = `
        <div class="flex">
          <div class="line-numbers text-right pr-4 select-none text-muted-foreground" style="user-select: none;">
            ${lines.map((_, i) => `<div>${i + 1}</div>`).join('')}
          </div>
          <div class="flex-1 overflow-x-auto">
            ${highlightSyntax(code)}
          </div>
        </div>
      `;
    };

    // Initial highlighting
    updateHighlighting();

    // Set up event listeners
    const textarea = textareaRef.current;
    textarea.addEventListener('input', updateHighlighting);
    textarea.addEventListener('scroll', () => {
      if (!editorRef.current || !textareaRef.current) return;
      editorRef.current.scrollTop = textareaRef.current.scrollTop;
      editorRef.current.scrollLeft = textareaRef.current.scrollLeft;
    });

    return () => {
      textarea.removeEventListener('input', updateHighlighting);
      textarea.removeEventListener('scroll', () => {});
    };
  }, []);

  return (
    <div className="relative h-full font-mono text-sm">
      <div
        ref={editorRef}
        className="absolute inset-0 p-4 whitespace-pre overflow-auto bg-[#0d1117] text-[#c9d1d9]"
      ></div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 p-4 whitespace-pre overflow-auto bg-transparent text-transparent caret-white resize-none outline-none"
        spellCheck="false"
        readOnly={readOnly}
      ></textarea>
    </div>
  );
}