
import React from 'react';
import { BrainCircuitIcon } from './common/Icon';

const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center gap-3">
          <BrainCircuitIcon className="h-8 w-8 text-brand-primary" />
          <h1 className="text-2xl font-bold text-content-strong tracking-tight">
            AI Business Intelligence Assistant
          </h1>
        </div>
      </div>
       <div className="h-0.5 bg-gradient-to-r from-brand-primary via-brand-secondary to-purple-500"></div>
    </header>
  );
};

export default Header;
