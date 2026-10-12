import React, { useState, useEffect } from 'react';
import type { Flashcard, FlashcardFormData, FormErrors, Difficulty, Category } from '../types';
import { X, Sparkles, AlertCircle, Check } from 'lucide-react';

interface FlashcardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FlashcardFormData) => void;
  editingCard?: Flashcard | null;
  categories: Category[];
}

export const FlashcardForm: React.FC<FlashcardFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCard,
  categories,
}) => {
  const [formData, setFormData] = useState<FlashcardFormData>({
    question: '',
    answer: '',
    category: categories[0]?.name || 'Web Development',
    difficulty: 'Medium',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    if (editingCard) {
      setFormData({
        question: editingCard.question,
        answer: editingCard.answer,
        category: editingCard.category,
        difficulty: editingCard.difficulty,
      });
      const exists = categories.some((c) => c.name === editingCard.category);
      if (!exists) {
        setIsCustomCategory(true);
        setCustomCategory(editingCard.category);
      } else {
        setIsCustomCategory(false);
      }
    } else {
      setFormData({
        question: '',
        answer: '',
        category: categories[0]?.name || 'Web Development',
        difficulty: 'Medium',
      });
      setIsCustomCategory(false);
      setCustomCategory('');
    }
    setErrors({});
    setTouched({});
  }, [editingCard, isOpen, categories]);

  const validate = (data: FlashcardFormData): FormErrors => {
    const errs: FormErrors = {};
    if (!data.question.trim()) {
      errs.question = 'Question is required';
    } else if (data.question.trim().length < 3) {
      errs.question = 'Question must be at least 3 characters long';
    }

    if (!data.answer.trim()) {
      errs.answer = 'Answer is required';
    } else if (data.answer.trim().length < 2) {
      errs.answer = 'Answer must be at least 2 characters long';
    }

    const catName = isCustomCategory ? customCategory.trim() : data.category;
    if (!catName) {
      errs.category = 'Category is required';
    }

    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  };

  const handleChange = (field: keyof FlashcardFormData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (touched[field]) {
      setErrors(validate(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isCustomCategory ? customCategory.trim() : formData.category;
    const dataToSubmit: FlashcardFormData = {
      ...formData,
      category: finalCategory,
    };

    const validationErrors = validate(dataToSubmit);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({ question: true, answer: true, category: true, difficulty: true });
      return;
    }

    onSubmit(dataToSubmit);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingCard ? 'Edit Flashcard' : 'Create New Flashcard'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {editingCard ? 'Update question and answer content' : 'Add a new study card to your collection'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Question Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Question (Front Side) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.question}
              onChange={(e) => handleChange('question', e.target.value)}
              onBlur={() => handleBlur('question')}
              placeholder="e.g. What is the difference between let and const in JavaScript?"
              className={`w-full px-4 py-3 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                touched.question && errors.question
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
            />
            {touched.question && errors.question && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-500 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.question}
              </div>
            )}
          </div>

          {/* Answer Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Answer (Back Side) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.answer}
              onChange={(e) => handleChange('answer', e.target.value)}
              onBlur={() => handleBlur('answer')}
              placeholder="e.g. 'let' allows re-assignment while 'const' creates a block-scoped constant reference."
              className={`w-full px-4 py-3 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                touched.answer && errors.answer
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
            />
            {touched.answer && errors.answer && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-500 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.answer}
              </div>
            )}
          </div>

          {/* Category & Difficulty Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Subject / Category <span className="text-rose-500">*</span>
              </label>
              {!isCustomCategory ? (
                <select
                  value={formData.category}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomCategory(true);
                    } else {
                      handleChange('category', e.target.value);
                    }
                  }}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="__custom__">+ Create Custom Category...</option>
                </select>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter new subject name..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(false)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    ← Select from existing categories
                  </button>
                </div>
              )}
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => handleChange('difficulty', level)}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      formData.difficulty === level
                        ? level === 'Easy'
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : level === 'Medium'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-rose-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {editingCard ? 'Save Changes' : 'Create Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
