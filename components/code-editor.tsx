"use client";

import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps) {
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // 初始检测
    checkMobile();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkMobile);
    
    // 清理
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 使用CodeMirror的onChange事件处理程序
  const handleChange = (val: string) => {
    onChange(val);
  };

  // 自定义样式
  const customTheme = EditorView.theme({
    '&': {
      height: '100%',
      fontSize: isMobile ? '12px' : '14px',
    },
    '.cm-scroller': {
      overflow: 'auto',
      fontFamily: 'monospace',
    },
    '.cm-content': {
      caretColor: readOnly ? 'transparent' : 'white',
    },
    '.cm-line': {
      padding: '0 4px',
      lineHeight: '1.6',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'rgba(66, 133, 244, 0.1)',
    },
    '.cm-gutters': {
      backgroundColor: '#0d1117',
      color: '#636e7b',
      border: 'none',
    },
    // 移动端优化
    '@media (max-width: 768px)': {
      '.cm-gutters': {
        paddingRight: '8px',
        paddingLeft: '8px',
      },
      '.cm-line': {
        padding: '0 2px',
      },
    },
  });

  return (
    <div className="h-full w-full font-mono text-sm flex-1 min-h-0 relative">
      <CodeMirror
        value={value}
        height="100%"
        width="100%"
        theme={oneDark}
        extensions={[
          xml(), 
          customTheme,
          EditorView.lineWrapping,
        ]}
        onChange={handleChange}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          autocompletion: !isMobile, // 在移动设备上禁用自动完成，以减少UI干扰
          foldGutter: !isMobile, // 在移动设备上禁用折叠功能，以节省空间
          dropCursor: true,
          allowMultipleSelections: !isMobile, // 在移动设备上禁用多选，简化交互
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          rectangularSelection: !isMobile, // 在移动设备上禁用矩形选择
          crosshairCursor: false, // 禁用十字光标，在移动设备上可能会干扰
          highlightActiveLineGutter: true,
        }}
        placeholder="Enter SVG code..."
        className="h-full w-full"
      />
      
      {/* 移动设备上的编辑提示 */}
      {isMobile && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 text-center pointer-events-none opacity-70">
          Tap to edit • Use keyboard for precise control
        </div>
      )}
    </div>
  );
}