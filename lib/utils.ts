import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function beautifySVG(svgString: string) {
  // 创建 DOMParser 解析 SVG 字符串
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  
  // 创建格式化函数
  function formatNode(node: Node, level: number) {
    const indent = '  '.repeat(level);
    
    // 处理文本节点
    if (node.nodeType === 3) {
      const text = node.textContent?.trim();
      if (text) {
        return indent + text;
      }
      return '';
    }
    
    // 处理元素节点
    if (node.nodeType === 1) {
      let result = indent + '<' + node.nodeName;
      
      // 添加属性
      for (let i = 0; i < (node as Element).attributes.length; i++) {
        const attr = (node as Element).attributes[i];
        result += ' ' + attr.name + '="' + attr.value + '"';
      }
      
      // 如果没有子节点，使用自闭合标签
      if (node.childNodes.length === 0) {
        return result + ' />';
      }
      
      result += '>';
      
      // 处理子节点
      let hasNonTextChildren = false;
      let childContent = '';
      
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.nodeType === 1) {
          hasNonTextChildren = true;
          childContent += '\n' + formatNode(child, level + 1);
        } else if (child.nodeType === 3 && child.textContent?.trim()) {
          childContent += '\n' + '  '.repeat(level + 1) + child.textContent?.trim();
        }
      }
      
      if (hasNonTextChildren || childContent.includes('\n')) {
        result += childContent + '\n' + indent;
      }
      
      return result + '</' + node.nodeName + '>';
    }
    
    return '';
  }
  
  // 从根节点开始格式化
  return formatNode(doc.documentElement, 0);
}
