
export const homeDefaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600">
  <!-- Background with Nordic gradient -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#F9F9F9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E5E9F0;stop-opacity:1" />
    </linearGradient>
    
    <!-- Geometric patterns -->
    <pattern id="nordicPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M0,20 L40,20 M20,0 L20,40" stroke="#D8DEE9" stroke-width="1"/>
    </pattern>
    
    <!-- Soft shadow for elements -->
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#88C0D0" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Main background -->
  <rect width="1000" height="600" fill="url(#bgGradient)" />
  <rect width="1000" height="600" fill="url(#nordicPattern)" opacity="0.4" />
  
  <!-- Decorative elements -->
  <circle cx="120" cy="120" r="80" fill="#81A1C1" opacity="0.7" />
  <circle cx="850" cy="480" r="100" fill="#5E81AC" opacity="0.5" />
  
  <!-- Abstract geometric shapes -->
  <polygon points="800,100 900,150 850,200 750,180" fill="#88C0D0" opacity="0.6" filter="url(#softShadow)" />
  <polygon points="150,450 250,420 230,520 130,500" fill="#81A1C1" opacity="0.4" filter="url(#softShadow)" />
  
  <!-- Scandinavian decorative lines -->
  <line x1="0" y1="300" x2="1000" y2="300" stroke="#D8DEE9" stroke-width="1" />
  <line x1="0" y1="305" x2="1000" y2="305" stroke="#D8DEE9" stroke-width="0.5" />
  
  <!-- Simple wood-inspired texture at the bottom -->
  <rect x="0" y="550" width="1000" height="50" fill="#EBCB8B" opacity="0.1" />
  <line x1="0" y1="560" x2="1000" y2="560" stroke="#D08770" stroke-width="0.5" opacity="0.3" />
  <line x1="0" y1="570" x2="1000" y2="570" stroke="#D08770" stroke-width="0.5" opacity="0.3" />
  <line x1="0" y1="580" x2="1000" y2="580" stroke="#D08770" stroke-width="0.5" opacity="0.3" />
  <line x1="0" y1="590" x2="1000" y2="590" stroke="#D08770" stroke-width="0.5" opacity="0.3" />
  
  <!-- Main content with Nordic typography -->
  <text x="500" y="180" font-family="'Helvetica Neue', Arial, sans-serif" font-size="52" font-weight="200" text-anchor="middle" fill="#3B4252" letter-spacing="5">
    WELCOME TO
  </text>
  
  <text x="500" y="270" font-family="'Helvetica Neue', Arial, sans-serif" font-size="86" font-weight="600" text-anchor="middle" fill="#5E81AC" filter="url(#softShadow)">
    SVGViewer.app
  </text>
  
  <text x="500" y="330" font-family="'Helvetica Neue', Arial, sans-serif" font-size="28" font-weight="300" text-anchor="middle" fill="#4C566A" letter-spacing="2">
    Visualize • Create • Share
  </text>
  
  <!-- Nordic-inspired minimal button -->
  <rect x="350" y="380" width="300" height="70" rx="4" fill="#81A1C1" filter="url(#softShadow)" />
  <rect x="350" y="380" width="300" height="6" rx="2" fill="#88C0D0" />
  <text x="500" y="427" font-family="'Helvetica Neue', Arial, sans-serif" font-size="28" font-weight="500" text-anchor="middle" fill="#ECEFF4" letter-spacing="1">
    EXPLORE NOW
  </text>
  
  <!-- URL with Nordic styling -->
  <text x="500" y="500" font-family="'Helvetica Neue', Arial, sans-serif" font-size="24" font-weight="300" text-anchor="middle" fill="#4C566A">
    https://svgviewer.app
  </text>
  
  <!-- Nordic rune-inspired decorative elements -->
  <path d="M300,520 L320,540 L300,560 L280,540 Z" fill="#5E81AC" opacity="0.7" />
  <path d="M500,520 L520,540 L500,560 L480,540 Z" fill="#5E81AC" opacity="0.7" />
  <path d="M700,520 L720,540 L700,560 L680,540 Z" fill="#5E81AC" opacity="0.7" />
  <line x1="330" y1="540" x2="480" y2="540" stroke="#5E81AC" stroke-width="2" opacity="0.7" />
  <line x1="520" y1="540" x2="680" y2="540" stroke="#5E81AC" stroke-width="2" opacity="0.7" />
</svg>`