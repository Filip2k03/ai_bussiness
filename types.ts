import type { ReactNode } from 'react';

export enum TaskType {
  KEY_INSIGHTS = 'Key Insights',
  SWOT = 'SWOT Analysis',
  CONTENT_ENHANCER = 'Content Enhancer',
  HUMANIZE_TEXT = 'Humanize Text',
  CODE_GENERATOR = 'Code Generator',
  CODE_DEBUGGER = 'Code Debugger',
  IMAGE_ANALYSIS = 'Image Analysis',
  VIDEO_ANALYSIS = 'Video Analysis',
  DIAGRAM_AI = 'Diagram AI',
  IMAGE_CREATE = 'Image Creator AI',
  STORYBOARD_CREATOR = 'Storyboard Creator AI',
}

export interface Task {
  id: TaskType;
  title: string;
  description: string;
  icon: ReactNode;
  placeholder: string;
  accepts: 'text' | 'image' | 'video';
}