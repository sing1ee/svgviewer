"use client";

import { useEffect } from 'react';
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
  // 使用CodeMirror的onChange事件处理程序
  const handleChange = (val: string) => {
    onChange(val);
  };

  // 自定义样式
  const customTheme = EditorView.theme({
    '&': {
      height: '100%',
      fontSize: '14px',
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
  });

  return (
    <div className="h-full w-full font-mono text-sm flex-1 min-h-0">
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
          autocompletion: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLineGutter: true,
        }}
        placeholder="输入SVG代码..."
        className="h-full w-full"
      />
    </div>
  );
}