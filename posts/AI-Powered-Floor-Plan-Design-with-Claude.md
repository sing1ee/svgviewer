---
title: 'Using Claude 3.7 for Interior Floor Plan Design'
date: '2024-03-03'
description: 'AI Powered FloorPlan Design with Claude'
---
Using Claude 3.7 for Interior Floor Plan Design

Claude 3.7 is Anthropic's latest AI model, featuring superior code generation capabilities while possessing exceptional aesthetic sense.

We can leverage these capabilities for many purposes. Here's an example of interior floor plan design.

# Prompt

For Claude 3.7, there's no need for carefully crafted prompts. You can simply state your requirements directly:

```txt
Help me create a floor plan design for a house using SVG code, with attention to aesthetics.
```

# SVG Code

```svg
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="800" height="600" fill="#f8f8f8"/>
  
  <!-- House Outline -->
  <rect x="100" y="100" width="600" height="400" fill="#ffffff" stroke="#333333" stroke-width="3"/>
  
  <!-- Interior Walls -->
  <!-- Living Room / Kitchen Divider -->
  <line x1="400" y1="100" x2="400" y2="300" stroke="#333333" stroke-width="2"/>
  
  <!-- Bedroom Area Divider -->
  <line x1="100" y1="300" x2="700" y2="300" stroke="#333333" stroke-width="2"/>
  
  <!-- Bedroom Dividers -->
  <line x1="300" y1="300" x2="300" y2="500" stroke="#333333" stroke-width="2"/>
  <line x1="500" y1="300" x2="500" y2="500" stroke="#333333" stroke-width="2"/>
  
  <!-- Bathroom Walls -->
  <rect x="500" y="100" width="100" height="100" fill="#ffffff" stroke="#333333" stroke-width="2"/>
  <rect x="100" y="400" width="100" height="100" fill="#ffffff" stroke="#333333" stroke-width="2"/>
  
  <!-- Doors -->
  <!-- Front Door -->
  <line x1="400" y1="100" x2="450" y2="100" stroke="#ffffff" stroke-width="3"/>
  <path d="M 400,100 A 50,50 0 0 1 450,100" fill="none" stroke="#333333" stroke-width="1"/>
  
  <!-- Bathroom Doors -->
  <line x1="550" y1="170" x2="550" y2="200" stroke="#ffffff" stroke-width="2"/>
  <path d="M 550,170 A 30,30 0 0 0 550,200" fill="none" stroke="#333333" stroke-width="1"/>
  
  <line x1="170" y1="400" x2="200" y2="400" stroke="#ffffff" stroke-width="2"/>
  <path d="M 170,400 A 30,30 0 0 1 200,400" fill="none" stroke="#333333" stroke-width="1"/>
  
  <!-- Bedroom Doors -->
  <line x1="200" y1="300" x2="230" y2="300" stroke="#ffffff" stroke-width="2"/>
  <path d="M 200,300 A 30,30 0 0 0 230,300" fill="none" stroke="#333333" stroke-width="1"/>
  
  <line x1="400" y1="300" x2="430" y2="300" stroke="#ffffff" stroke-width="2"/>
  <path d="M 400,300 A 30,30 0 0 0 430,300" fill="none" stroke="#333333" stroke-width="1"/>
  
  <line x1="600" y1="300" x2="630" y2="300" stroke="#ffffff" stroke-width="2"/>
  <path d="M 600,300 A 30,30 0 0 0 630,300" fill="none" stroke="#333333" stroke-width="1"/>
  
  <!-- Patio Door -->
  <line x1="700" y1="200" x2="700" y2="250" stroke="#ffffff" stroke-width="3"/>
  <line x1="695" y1="200" x2="695" y2="250" stroke="#333333" stroke-width="1"/>
  <line x1="705" y1="200" x2="705" y2="250" stroke="#333333" stroke-width="1"/>
  
  <!-- Windows -->
  <rect x="150" y="100" width="80" height="5" fill="#a8d3ff" stroke="#333333" stroke-width="1"/>
  <rect x="250" y="100" width="80" height="5" fill="#a8d3ff" stroke="#333333" stroke-width="1"/>
  <rect x="600" y="100" width="80" height="5" fill="#a8d3ff" stroke="#333333" stroke-width="1"/>
  <rect x="100" y="150" width="5" height="80" fill="#a8d3ff" stroke="#333333" stroke-width="1"/>
  <rect x="100" y="350" width="5" height="80" fill="#a8d3ff" stroke="#333333" stroke-width="1"/>
  <rect x="700" y="350" width="5" height="80" fill="#a8d3ff" stroke="#333333" stroke-width="1"/>
  <rect x="200" y="500" width="80" height="5" fill="#a8d3ff" stroke="#333333" stroke-width="1"/>
  <rect x="400" y="500" width="80" height="5" fill="#a8d3ff" stroke="#333333" stroke-width="1"/>
  <rect x="600" y="500" width="80" height="5" fill="#a8d3ff" stroke="#333333" stroke-width="1"/>
  
  <!-- Furniture -->
  <!-- Living Room -->
  <rect x="150" y="180" width="120" height="70" rx="5" fill="#d9c7b8" stroke="#333333" stroke-width="1"/>
  <rect x="300" y="180" width="60" height="60" rx="5" fill="#d9c7b8" stroke="#333333" stroke-width="1"/>
  <circle cx="250" cy="150" r="30" fill="#e6e6e6" stroke="#333333" stroke-width="1"/>
  
  <!-- Kitchen -->
  <rect x="420" y="120" width="60" height="160" rx="0" fill="#d3d3d3" stroke="#333333" stroke-width="1"/>
  <rect x="420" y="120" width="60" height="40" rx="0" fill="#a0a0a0" stroke="#333333" stroke-width="1"/>
  <circle cx="450" cy="220" r="20" fill="#e6e6e6" stroke="#333333" stroke-width="1"/>
  
  <!-- Dining Area -->
  <circle cx="620" cy="200" r="30" fill="#d9c7b8" stroke="#333333" stroke-width="1"/>
  <circle cx="620" cy="200" r="20" fill="#ffffff" stroke="#333333" stroke-width="1"/>
  
  <!-- Bedrooms -->
  <!-- Bed 1 -->
  <rect x="150" y="330" width="100" height="60" rx="5" fill="#c6dcef" stroke="#333333" stroke-width="1"/>
  <rect x="150" y="330" width="20" height="60" rx="5" fill="#a8c8e6" stroke="#333333" stroke-width="1"/>
  
  <!-- Bed 2 -->
  <rect x="350" y="330" width="100" height="60" rx="5" fill="#c6dcef" stroke="#333333" stroke-width="1"/>
  <rect x="350" y="330" width="20" height="60" rx="5" fill="#a8c8e6" stroke="#333333" stroke-width="1"/>
  
  <!-- Bed 3 (Master) -->
  <rect x="550" y="330" width="120" height="80" rx="5" fill="#c6dcef" stroke="#333333" stroke-width="1"/>
  <rect x="550" y="330" width="25" height="80" rx="5" fill="#a8c8e6" stroke="#333333" stroke-width="1"/>
  
  <!-- Bathroom Fixtures -->
  <!-- Bathroom 1 -->
  <rect x="520" y="120" width="60" height="35" rx="3" fill="#ffffff" stroke="#333333" stroke-width="1"/>
  <circle cx="540" cy="170" r="15" fill="#ffffff" stroke="#333333" stroke-width="1"/>
  
  <!-- Bathroom 2 -->
  <rect x="120" y="420" width="60" height="35" rx="3" fill="#ffffff" stroke="#333333" stroke-width="1"/>
  <circle cx="140" cy="470" r="15" fill="#ffffff" stroke="#333333" stroke-width="1"/>
  
  <!-- Patio -->
  <rect x="700" y="150" width="80" height="150" fill="#e6f2e6" stroke="#333333" stroke-width="1" stroke-dasharray="5,5"/>
  <circle cx="740" cy="200" r="15" fill="#d9c7b8" stroke="#333333" stroke-width="1"/>
  <circle cx="740" cy="250" r="15" fill="#d9c7b8" stroke="#333333" stroke-width="1"/>
  
  <!-- Labels -->
  <text x="250" y="200" font-family="Arial" font-size="14" text-anchor="middle" fill="#333333">Living Room</text>
  <text x="450" y="170" font-family="Arial" font-size="14" text-anchor="middle" fill="#333333">Kitchen</text>
  <text x="620" y="170" font-family="Arial" font-size="14" text-anchor="middle" fill="#333333">Dining</text>
  <text x="200" y="370" font-family="Arial" font-size="14" text-anchor="middle" fill="#333333">Bedroom 1</text>
  <text x="400" y="370" font-family="Arial" font-size="14" text-anchor="middle" fill="#333333">Bedroom 2</text>
  <text x="600" y="370" font-family="Arial" font-size="14" text-anchor="middle" fill="#333333">Master Bedroom</text>
  <text x="550" y="150" font-family="Arial" font-size="12" text-anchor="middle" fill="#333333">Bath 1</text>
  <text x="150" y="450" font-family="Arial" font-size="12" text-anchor="middle" fill="#333333">Bath 2</text>
  <text x="740" y="225" font-family="Arial" font-size="14" text-anchor="middle" fill="#333333">Patio</text>
  
  <!-- North Arrow -->
  <polygon points="50,50 40,70 50,65 60,70" fill="#333333"/>
  <text x="50" y="40" font-family="Arial" font-size="12" text-anchor="middle" fill="#333333">N</text>
  
  <!-- Scale -->
  <line x1="100" y1="550" x2="300" y2="550" stroke="#333333" stroke-width="2"/>
  <line x1="100" y1="545" x2="100" y2="555" stroke="#333333" stroke-width="2"/>
  <line x1="300" y1="545" x2="300" y2="555" stroke="#333333" stroke-width="2"/>
  <text x="200" y="540" font-family="Arial" font-size="12" text-anchor="middle" fill="#333333">0 5 10 15 20 ft</text>
  
  <!-- Title -->
  <text x="400" y="580" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle" fill="#333333">Modern Family Home - Floor Plan</text>
</svg>

```

# Summary
If you have additional requirements, you can simply continue the dialogue with Claude. If you want to save the SVG as an image, you can use our [svg to image](https://svgviewer.app/svg-converter) tool, which allows you to save in PNG, JPEG, or WEBP formats.