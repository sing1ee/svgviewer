"use client";

import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // 导入暗色主题
import 'prismjs/components/prism-markup'; // SVG 是基于 XML 的，所以导入 markup 语法

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // 更新高亮显示
  useEffect(() => {
    if (preRef.current) {
      preRef.current.textContent = value;
      Prism.highlightElement(preRef.current);
    }
  }, [value]);

  // 处理滚动同步
  useEffect(() => {
    const textarea = textareaRef.current;
    const pre = preRef.current;
    
    if (!textarea || !pre) return;
    
    const syncScroll = () => {
      pre.scrollTop = textarea.scrollTop;
      pre.scrollLeft = textarea.scrollLeft;
    };
    
    textarea.addEventListener('scroll', syncScroll);
    return () => textarea.removeEventListener('scroll', syncScroll);
  }, []);

  return (
    <div className="relative h-full font-mono text-sm">
      <pre 
        ref={preRef}
        className="absolute inset-0 p-4 m-0 whitespace-pre overflow-auto bg-[#0d1117] pointer-events-none"
        aria-hidden="true"
      ><code className="language-markup"></code></pre>
      
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 p-4 whitespace-pre overflow-auto bg-transparent text-transparent caret-white resize-none outline-none w-full h-full"
        spellCheck="false"
        readOnly={readOnly}
      ></textarea>
    </div>
  );
}