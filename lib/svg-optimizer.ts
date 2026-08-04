// 仅对这些纯数值的几何/外观属性做小数位压缩；避免对 fill/stroke/href/id/filter 等
// 含引用或颜色的属性做改动，以免破坏引用或颜色值
const ROUNDABLE_ATTRS = new Set([
  'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry',
  'width', 'height', 'fx', 'fy', 'd', 'points', 'pathLength',
  'stroke-width', 'opacity', 'fill-opacity', 'stroke-opacity',
  'stop-opacity', 'offset', 'font-size', 'rotate', 'scale', 'transform',
]);

export function optimizeSvg(svgCode: string): string {
  if (!svgCode) return '';

  try {
    // Parse SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');

    // Check for parsing errors
    const parserError = svgDoc.querySelector('parsererror');
    if (parserError) {
      return svgCode; // Return original if there's a parsing error
    }

    // Basic optimizations

    // 1. Remove comments
    const nodeIterator = document.createNodeIterator(
      svgDoc,
      NodeFilter.SHOW_COMMENT,
      null
    );

    let commentNode;
    const commentsToRemove = [];
    while ((commentNode = nodeIterator.nextNode())) {
      commentsToRemove.push(commentNode);
    }

    commentsToRemove.forEach(comment => {
      comment.parentNode?.removeChild(comment);
    });

    // 2. Remove empty attributes
    const allElements = svgDoc.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      const attributes = element.attributes;

      for (let j = attributes.length - 1; j >= 0; j--) {
        const attr = attributes[j];
        if (attr.value === '') {
          element.removeAttribute(attr.name);
        }
      }
    }

    // 3. Round numeric values to fewer decimal places（仅限安全属性，避免改动引用/颜色）
    const allElementsArray = Array.from(allElements);
    allElementsArray.forEach(element => {
      const attributes = element.attributes;

      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        if (!ROUNDABLE_ATTRS.has(attr.name)) continue;

        // Check if attribute value contains numbers with decimals
        if (/[0-9]+\.[0-9]{3,}/.test(attr.value)) {
          // Replace numbers with many decimal places with rounded versions
          const newValue = attr.value.replace(
            /([0-9]+\.[0-9]{3,})/g,
            (match) => parseFloat(match).toFixed(2)
          );

          element.setAttribute(attr.name, newValue);
        }
      }
    });

    // 4. Serialize back to string
    const serializer = new XMLSerializer();
    let optimizedSvg = serializer.serializeToString(svgDoc);

    // 5. Remove XML declaration if present
    // 注：不做 `>\s+<` → `><` 的空白压缩，那会删掉 <text>/<tspan> 之间有意义的空白
    optimizedSvg = optimizedSvg.replace(/<\?xml[^>]*>/, '');

    return optimizedSvg;
  } catch (error) {
    console.error('Error optimizing SVG:', error);
    return svgCode; // Return original on error
  }
}