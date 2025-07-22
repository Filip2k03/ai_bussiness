import React, { useState, useCallback } from 'react';
import { TaskType } from './types';
import { TASKS } from './constants';
import Header from './components/Header';
import TaskSelector from './components/TaskSelector';
import TextInput from './components/TextInput';
import OutputDisplay from './components/OutputDisplay';
import { generateInsights } from './services/geminiService';

const App: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<TaskType>(TaskType.KEY_INSIGHTS);
  const [inputText, setInputText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string | string[]>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectTask = useCallback((task: TaskType) => {
    setSelectedTask(task);
    setInputText('');
    setFile(null);
    setOutput('');
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    const task = TASKS.find(t => t.id === selectedTask);
    if (!task) return;

    // Validation
    if ((task.accepts === 'image' || task.accepts === 'video') && !file) {
      setError('Please upload a file for this task.');
      return;
    }
    if (task.accepts === 'text' && !inputText.trim()) {
      setError('Input text cannot be empty.');
      return;
    }

    setIsLoading(true);
    setOutput('');
    setError(null);

    try {
      const result = await generateInsights(selectedTask, inputText, file);
      setOutput(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`An error occurred: ${e.message}`);
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [inputText, selectedTask, file]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Controls */}
          <div className="lg:w-2/5 flex flex-col gap-6">
            <TaskSelector
              selectedTask={selectedTask}
              onSelectTask={handleSelectTask}
            />
            <TextInput
              textValue={inputText}
              onTextChange={setInputText}
              file={file}
              onFileChange={setFile}
              onClearFile={() => setFile(null)}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              selectedTask={selectedTask}
            />
          </div>

          {/* Right Column: Output */}
          <div className="lg:w-3/5">
            <OutputDisplay
              isLoading={isLoading}
              output={output}
              error={error}
              task={TASKS.find(t => t.id === selectedTask)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;