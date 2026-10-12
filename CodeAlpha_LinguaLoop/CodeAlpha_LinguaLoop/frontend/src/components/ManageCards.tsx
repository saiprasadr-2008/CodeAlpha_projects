import React, { useState } from 'react';
import type { Flashcard, Category } from '../types';
import { EmptyState } from './EmptyState';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Layers,
  LayoutGrid,
  List,
} from 'lucide-react';

interface ManageCardsProps {
  cards: Flashcard[];
  categories: Category[];
  onOpenAddModal: () => void;
  onEditCard: (card: Flashcard) => void;
  onDeleteCard: (id: string) => void;
  onResetData: () => void;
  onImportCards: (cards: Flashcard[]) => void;
}

export const ManageCards: React.FC<ManageCardsProps> = ({
  cards,
  categories,
  onOpenAddModal,
  onEditCard,
  onDeleteCard,
  onResetData,
  onImportCards,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewStyle, setViewStyle] = useState<'grid' | 'table'>('grid');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtering
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || card.category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === 'all' || card.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Export Data JSON
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(cards, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashlearn-cards-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Data JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImportCards(parsed);
        } else {
          alert('Invalid file format. Expected a JSON array of flashcards.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header & Bulk Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            Manage Flashcards ({cards.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, edit, organize categories, or export your card decks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Card
          </button>

          <button
            onClick={handleExportJSON}
            title="Export deck as JSON"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            Export
          </button>

          <label
            title="Import deck from JSON file"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-purple-500" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (confirm('Reset to initial sample flashcards? Current cards will be overwritten.')) {
                onResetData();
              }
            }}
            title="Reset to default sample cards"
            className="p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl hover:bg-rose-100 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or answers..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category & Difficulty Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:outline-none"
          >
            <option value="all">All Subjects</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Difficulty filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Grid / Table Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 ml-auto">
            <button
              onClick={() => setViewStyle('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewStyle === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewStyle('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewStyle === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      {filteredCards.length === 0 ? (
        <EmptyState
          title="No Matching Flashcards"
          description="No flashcards match your current search query or filter selection. Try clearing filters or create a new card."
          actionLabel="Add New Card"
          onAction={onOpenAddModal}
          iconType="search"
        />
      ) : viewStyle === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                    {card.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      card.difficulty === 'Easy'
                        ? 'bg-emerald-100 text-emerald-700'
                        : card.difficulty === 'Hard'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {card.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2">
                    {card.question}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {card.answer}
                  </p>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Reviewed: {card.timesReviewed}x
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditCard(card)}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all cursor-pointer"
                    title="Edit Card"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {deletingId === card.id ? (
                    <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950 p-1 rounded-lg border border-rose-200">
                      <button
                        onClick={() => {
                          onDeleteCard(card.id);
                          setDeletingId(null);
                        }}
                        className="text-[10px] font-bold px-2 py-1 bg-rose-600 text-white rounded cursor-pointer"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="text-[10px] px-1 text-slate-500 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(card.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 transition-all cursor-pointer"
                      title="Delete Card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Question</th>
                  <th className="p-4">Answer</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Mastery</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                      {card.question}
                    </td>
                    <td className="p-4 max-w-md truncate text-slate-500 dark:text-slate-400">
                      {card.answer}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100">
                        {card.category}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-semibold">{card.difficulty}</span>
                    </td>
                    <td className="p-4 whitespace-nowrap font-bold text-slate-700 dark:text-slate-300">
                      {card.mastery}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditCard(card)}
                          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteCard(card.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
