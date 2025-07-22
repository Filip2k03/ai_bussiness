import React, { useRef, useState } from 'react';
import { SendIcon, UploadCloudIcon, FileIcon, XCircleIcon } from './common/Icon';
import Spinner from './common/Spinner';
import { TaskType } from '../types';
import { TASKS } from '../constants';

interface TextInputProps {
  textValue: string;
  onTextChange: (value: string) => void;
  file: File | null;
  onFileChange: (file: File) => void;
  onClearFile: () => void;
  onGenerate: () => void;
  isLoading: boolean;
  selectedTask: TaskType;
}

const TextInput: React.FC<TextInputProps> = ({ textValue, onTextChange, file, onFileChange, onClearFile, onGenerate, isLoading, selectedTask }) => {
  const currentTask = TASKS.find(task => task.id === selectedTask);
  const placeholderText = currentTask ? currentTask.placeholder : "Enter your text here...";
  const acceptsFile = currentTask?.accepts === 'image' || currentTask?.accepts === 'video';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const renderFileInput = () => {
    if (file) {
      return (
        <div className="p-4 bg-base-300 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm overflow-hidden">
            <FileIcon className="h-5 w-5 flex-shrink-0 text-brand-primary"/>
            <span className="truncate text-content-strong">{file.name}</span>
          </div>
          <button onClick={onClearFile} disabled={isLoading} className="text-gray-400 hover:text-white disabled:opacity-50">
            <XCircleIcon className="h-6 w-6"/>
          </button>
        </div>
      );
    }

    return (
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-base-300 hover:border-brand-secondary'}`}
      >
        <UploadCloudIcon className="h-10 w-10 text-gray-500 mb-2"/>
        <p className="text-sm text-content-strong">
          <span className="font-semibold text-brand-secondary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-400">
          {currentTask?.accepts === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV, WEBM up to 50MB'}
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          className="hidden"
          accept={currentTask?.accepts === 'image' ? 'image/*' : 'video/*'}
        />
      </div>
    );
  };

  const getButtonText = () => {
    switch(selectedTask) {
      case TaskType.IMAGE_CREATE:
        return 'Generate Image';
      case TaskType.DIAGRAM_AI:
        return 'Generate Diagram';
      case TaskType.STORYBOARD_CREATOR:
        return 'Generate Storyboard';
      default:
        return 'Generate Analysis';
    }
  }

  const isButtonDisabled = isLoading || (acceptsFile && !file) || (!acceptsFile && !textValue.trim());

  return (
    <div className="flex flex-col gap-4 p-6 bg-base-200 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-content-strong">Input</h2>
      
      {acceptsFile && renderFileInput()}

      <textarea
        value={textValue}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={placeholderText}
        className="w-full h-40 p-4 bg-base-300 text-base-content rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow duration-200 resize-y"
        disabled={isLoading}
      />
      <button
        onClick={onGenerate}
        disabled={isButtonDisabled}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-brand-primary text-white font-bold rounded-md hover:bg-brand-secondary transition-colors duration-200 disabled:bg-base-300 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary"
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <SendIcon />
            <span>{getButtonText()}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default TextInput;