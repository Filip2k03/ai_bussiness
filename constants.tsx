import React from 'react';
import { Task, TaskType } from './types';
import { BarChartIcon, CodeIcon, LightBulbIcon, ShieldExclamationIcon, SparklesIcon, ImageIcon, VideoIcon, HumanizeIcon, DiagramIcon, ImageCreateIcon, VideoCreateIcon } from './components/common/Icon';

export const TASKS: Task[] = [
  {
    id: TaskType.KEY_INSIGHTS,
    title: 'Key Insights',
    description: 'Extract trends, sentiments, and opportunities from text.',
    icon: <LightBulbIcon />,
    placeholder: 'Paste customer feedback, market research, or meeting transcripts here to extract key insights...',
    accepts: 'text',
  },
  {
    id: TaskType.SWOT,
    title: 'SWOT Analysis',
    description: 'Generate a SWOT analysis from business descriptions.',
    icon: <BarChartIcon />,
    placeholder: 'Provide a description of your business, a competitor analysis, or a project plan to generate a SWOT analysis...',
    accepts: 'text',
  },
  {
    id: TaskType.CONTENT_ENHANCER,
    title: 'Content Enhancer',
    description: 'Improve clarity, tone, and impact of your writing.',
    icon: <SparklesIcon />,
    placeholder: 'Enter marketing copy, customer service scripts, or any text you want to refine for better communication...',
    accepts: 'text',
  },
  {
    id: TaskType.HUMANIZE_TEXT,
    title: 'Humanize Text',
    description: 'Rewrite text to sound more natural and empathetic.',
    icon: <HumanizeIcon />,
    placeholder: 'Paste your corporate jargon, technical writing, or any text you want to make more human-friendly...',
    accepts: 'text',
  },
  {
    id: TaskType.CODE_GENERATOR,
    title: 'Code Generator',
    description: 'Create code from a natural language description.',
    icon: <CodeIcon />,
    placeholder: 'Describe the function or component you want to build. For example, "Create a React button component with a loading state" or "Write a Python function to sort a list of objects by a specific key"...',
    accepts: 'text',
  },
  {
    id: TaskType.CODE_DEBUGGER,
    title: 'Code Debugger',
    description: 'Find and fix bugs in your code snippets.',
    icon: <ShieldExclamationIcon />,
    placeholder: 'Paste a code snippet and the error message you are receiving. The AI will analyze it and suggest a fix...',
    accepts: 'text',
  },
    {
    id: TaskType.DIAGRAM_AI,
    title: 'Diagram AI',
    description: 'Generate UML class diagrams from a description.',
    icon: <DiagramIcon />,
    placeholder: "Describe the classes, attributes, and relationships for your diagram. E.g., 'A Customer has a name and email, and can have many Orders. An Order has an ID and a total amount.'",
    accepts: 'text',
  },
  {
    id: TaskType.IMAGE_ANALYSIS,
    title: 'Image Analysis',
    description: 'Describe contents, extract text, or identify objects in an image.',
    icon: <ImageIcon />,
    placeholder: 'Optionally provide a prompt to guide the analysis, e.g., "What brand of car is this?" or "Extract all text from this screenshot."...',
    accepts: 'image',
  },
    {
    id: TaskType.IMAGE_CREATE,
    title: 'Image Creator AI',
    description: 'Generate a unique image from a text description.',
    icon: <ImageCreateIcon />,
    placeholder: 'Describe the image you want to create. Be detailed! E.g., "A photorealistic image of a red panda wearing a tiny chef hat, cooking a miniature pizza"...',
    accepts: 'text',
  },
  {
    id: TaskType.VIDEO_ANALYSIS,
    title: 'Video Analysis',
    description: 'Analyze a single frame from a video to describe its contents.',
    icon: <VideoIcon />,
    placeholder: 'Optionally provide a prompt to guide the analysis of a frame from your video...',
    accepts: 'video',
  },
   {
    id: TaskType.STORYBOARD_CREATOR,
    title: 'AI Storyboard Creator',
    description: 'Generate a sequence of images from a story prompt.',
    icon: <VideoCreateIcon />,
    placeholder: 'Describe a short story or scene. The AI will create a sequence of images to visualize it. E.g., "A robot exploring a mysterious, glowing cave"...',
    accepts: 'text',
  }
];