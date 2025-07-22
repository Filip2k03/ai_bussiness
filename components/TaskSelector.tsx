import React from 'react';
import { TaskType } from '../types';
import { TASKS } from '../constants';

interface TaskSelectorProps {
  selectedTask: TaskType;
  onSelectTask: (task: TaskType) => void;
}

const TaskSelector: React.FC<TaskSelectorProps> = ({ selectedTask, onSelectTask }) => {
  return (
    <div className="p-6 bg-base-200 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-content-strong mb-4">Choose Your AI Agent</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
        {TASKS.map((task) => (
          <button
            key={task.id}
            onClick={() => onSelectTask(task.id)}
            className={`p-4 rounded-lg text-left transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary h-full
              ${
                selectedTask === task.id
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'bg-base-300 hover:bg-base-300/80 text-base-content'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">{task.icon}</div>
              <div className="flex-1">
                <p className="font-bold text-sm">{task.title}</p>
                <p className={`text-xs ${selectedTask === task.id ? 'text-indigo-200' : 'text-gray-400'}`}>{task.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskSelector;
