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
    
    // 3. Round numeric values to fewer decimal places
    const allElementsArray = Array.from(allElements);
    allElementsArray.forEach(element => {
      const attributes = element.attributes;
      
      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        
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
    
    // 5. Remove unnecessary whitespace (basic)
    optimizedSvg = optimizedSvg.replace(/>\s+</g, '><');
    
    // 6. Remove XML declaration if present
    optimizedSvg = optimizedSvg.replace(/<\?xml[^>]*>/, '');
    
    return optimizedSvg;
  } catch (error) {
    console.error('Error optimizing SVG:', error);
    return svgCode; // Return original on error
  }
}