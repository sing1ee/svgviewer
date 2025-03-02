"use client";

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SquareIcon, CircleIcon, WineIcon as LineIcon, TypeIcon, PenToolIcon, ImageIcon, ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, AlignCenterIcon, AlignLeftIcon, AlignRightIcon, AlignJustifyIcon, RotateCwIcon, FlipHorizontalIcon, FlipVerticalIcon, ZoomInIcon, ZoomOutIcon, PaletteIcon, EyeIcon, EyeOffIcon, LayersIcon, CopyIcon, ScissorsIcon, UndoIcon, RedoIcon, SaveIcon, TrashIcon } from 'lucide-react';

interface SvgToolbarProps {
  onAddElement: (element: string) => void;
}

export default function SvgToolbar({ onAddElement }: SvgToolbarProps) {
  const handleAddRect = () => {
    onAddElement(`\n  <rect x="50" y="50" width="100" height="100" fill="#2563eb" />`);
  };

  const handleAddCircle = () => {
    onAddElement(`\n  <circle cx="100" cy="100" r="50" fill="#2563eb" />`);
  };

  const handleAddLine = () => {
    onAddElement(`\n  <line x1="50" y1="50" x2="150" y2="150" stroke="#2563eb" stroke-width="2" />`);
  };

  const handleAddText = () => {
    onAddElement(`\n  <text x="50" y="50" font-family="Arial" font-size="24" fill="#2563eb">Text</text>`);
  };

  const handleAddPath = () => {
    onAddElement(`\n  <path d="M50,50 L150,50 L100,150 Z" fill="#2563eb" />`);
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <TooltipProvider>
        <div className="grid grid-cols-1 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleAddRect}>
                <SquareIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Add Rectangle</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleAddCircle}>
                <CircleIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Add Circle</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleAddLine}>
                <LineIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Add Line</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleAddText}>
                <TypeIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Add Text</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleAddPath}>
                <PenToolIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Add Path</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="h-px bg-border my-2"></div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" disabled>
                <PaletteIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Color Picker</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" disabled>
                <RotateCwIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Rotate</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" disabled>
                <FlipHorizontalIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Flip Horizontal</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" disabled>
                <AlignCenterIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Align Center</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" disabled>
                <LayersIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Layers</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}