import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskType } from '../types';
import { CheckIcon, ClipboardIcon } from './common/Icon';
import Spinner from './common/Spinner';

// Make mermaid available globally
declare const mermaid: any;

interface OutputDisplayProps {
  isLoading: boolean;
  output: string | string[];
  error: string | null;
  task?: Task;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ isLoading, output, error, task }) => {
  const [copied, setCopied] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const outputText = typeof output === 'string' ? output : '';

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  useEffect(() => {
      if (task?.id === TaskType.DIAGRAM_AI && outputText && !isLoading) {
          try {
              if (mermaidRef.current) {
                  // The AI is instructed to return only the mermaid syntax.
                  // Remove the ```mermaid block if it exists for clean rendering.
                  const cleanOutput = outputText.replace(/^```mermaid\n/, '').replace(/\n```$/, '');
                  mermaidRef.current.innerHTML = cleanOutput;
                  mermaidRef.current.removeAttribute('data-processed');
                  mermaid.run({ nodes: [mermaidRef.current] });
              }
          } catch (e) {
              console.error("Mermaid rendering error:", e);
          }
      }
  }, [outputText, isLoading, task]);


  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
    }
  };

  const formatOutput = (text: string) => {
    // Basic markdown for headings and bold text
    let formattedText = text
      .replace(/## (.*?)\n/g, '<h2 class="text-xl font-bold text-content-strong mt-4 mb-2">$1</h2>')
      .replace(/### (.*?)\n/g, '<h3 class="text-lg font-semibold text-content-strong mt-3 mb-1">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-content-strong">$1</strong>')
      .replace(/```([\s\S]*?)```/g, (_match, code) => `<pre class="bg-base-300 p-4 rounded-md my-4 overflow-x-auto"><code class="font-mono text-sm text-indigo-300">${code.trim()}</code></pre>`);
      
    // Handle bullet points
    formattedText = formattedText.replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc">$1</li>');
    formattedText = formattedText.replace(/<\/li>\n<li/g, '</li><li'); // Fix spacing
    formattedText = `<ul>${formattedText}</ul>`.replace(/<\/ul>\n<ul>/g, ''); // Wrap lists

    // Replace newlines with <br />, but not inside pre/code blocks
    const parts = formattedText.split(/(<pre[\s\S]*?<\/pre>)/);
    return parts.map((part, index) => {
      if (index % 2 === 1) { // It's a pre/code block
        return part;
      }
      return part.replace(/\n/g, '<br />');
    });
  };
  
  const shouldShowCopyButton = () => {
    if (!output || Array.isArray(output)) return false;
    if (task?.id === TaskType.IMAGE_CREATE) return false;
    return true;
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-lg font-semibold text-content-strong animate-pulse-fast">AI is thinking...</p>
          <p className="text-sm text-gray-400">Analyzing your input for {task?.title || 'insights'}.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg text-red-300">
          <h3 className="font-bold text-red-200">Error</h3>
          <p>{error}</p>
        </div>
      );
    }

    if (output) {
       if (task?.id === TaskType.IMAGE_CREATE && typeof output === 'string' && output.startsWith('data:image/')) {
        return (
          <div className="flex items-center justify-center h-full">
            <img src={output} alt="AI generated content" className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
          </div>
        );
       }
       if (task?.id === TaskType.STORYBOARD_CREATOR && Array.isArray(output)) {
        return (
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-semibold text-content-strong mb-2 text-center">AI Storyboard</h3>
              <div className="flex-grow flex items-center overflow-x-auto overflow-y-hidden p-2 space-x-4">
                  {output.map((imgSrc, index) => (
                      <div key={index} className="flex-shrink-0 h-full w-4/5 md:w-[70%] rounded-lg shadow-lg bg-base-300 relative">
                          <img 
                              src={imgSrc} 
                              alt={`Storyboard scene ${index + 1}`}
                              className="w-full h-full object-contain rounded-lg"
                          />
                          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {index + 1} / {output.length}
                          </div>
                      </div>
                  ))}
              </div>
            </div>
        );
      }
       if (task?.id === TaskType.DIAGRAM_AI) {
         return (
              <div ref={mermaidRef} className="mermaid w-full h-full flex justify-center items-center bg-white rounded-md p-4">
                {/* Mermaid will render here */}
              </div>
         );
       }
      return (
        <div
          className="prose prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: formatOutput(outputText).join('') }}
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="text-5xl text-gray-600 mb-4">{task?.icon}</div>
        <h3 className="text-2xl font-bold text-content-strong">AI Output</h3>
        <p className="mt-2 text-gray-400">Your generated analysis will appear here once you provide an input.</p>
      </div>
    );
  };

  return (
    <div className="relative bg-base-200 rounded-lg shadow-lg min-h-[30rem] h-full p-6">
       {shouldShowCopyButton() && (
         <div className="absolute top-4 right-4 z-10">
           <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-base-300 text-base-content rounded-md hover:bg-brand-primary hover:text-white transition-colors text-xs"
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
       )}
      {renderContent()}
    </div>
  );
};

export default OutputDisplay;