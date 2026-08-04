import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function beautifySVG(svgString: string) {
  if (!svgString) return '';

  // 创建 DOMParser 解析 SVG 字符串
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");

  // 畸形 SVG 原样返回（与 optimizeSvg 行为一致）
  if (doc.querySelector('parsererror')) return svgString;

  // 转义属性值中的 & < "，避免破坏属性引号或产生非法 XML
  function escapeAttr(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  // 创建格式化函数
  function formatNode(node: Node, level: number): string {
    const indent = '  '.repeat(level);

    // 处理文本节点
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      return text ? indent + text : '';
    }

    // 处理注释节点（保留注释，避免静默丢失）
    if (node.nodeType === Node.COMMENT_NODE) {
      return indent + '<!--' + (node.textContent ?? '') + '-->';
    }

    // 处理元素节点
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      let result = indent + '<' + el.nodeName;

      // 添加属性
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        result += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
      }

      // 如果没有子节点，使用自闭合标签
      if (el.childNodes.length === 0) {
        return result + ' />';
      }

      result += '>';

      // 处理子节点
      let hasNonTextChildren = false;
      let childContent = '';

      for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.COMMENT_NODE) {
          hasNonTextChildren = true;
          childContent += '\n' + formatNode(child, level + 1);
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
          childContent += '\n' + '  '.repeat(level + 1) + child.textContent?.trim();
        }
      }

      if (hasNonTextChildren || childContent.includes('\n')) {
        result += childContent + '\n' + indent;
      }

      return result + '</' + el.nodeName + '>';
    }

    return '';
  }

  // 从根节点开始格式化
  return formatNode(doc.documentElement, 0);
}