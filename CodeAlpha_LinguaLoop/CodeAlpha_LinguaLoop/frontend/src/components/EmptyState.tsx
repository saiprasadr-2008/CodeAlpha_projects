import React from 'react';
import { Layers, Plus, Search, BookOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  iconType?: 'search' | 'cards' | 'quiz';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  iconType = 'cards',
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'search':
        return <Search className="w-12 h-12 text-slate-400 dark:text-slate-500" />;
      case 'quiz':
        return <BookOpen className="w-12 h-12 text-indigo-400 dark:text-indigo-500" />;
      default:
        return <Layers className="w-12 h-12 text-indigo-400 dark:text-indigo-500" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 my-6 transition-all">
      <div className="p-4 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 mb-4">
        {renderIcon()}
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
