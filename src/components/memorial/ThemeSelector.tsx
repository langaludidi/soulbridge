/**
 * ThemeSelector Component
 * Full-screen theme browser modal with categories
 * Allows users to select from 60+ themes or upload custom background
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Upload, Check } from 'lucide-react';
import { themes, themeCategories, type Theme } from '@/data/themes';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: Theme;
  onThemeSelect: (theme: Theme) => void;
  onCustomUpload?: (file: File) => void;
}

export function ThemeSelector({
  isOpen,
  onClose,
  currentTheme,
  onThemeSelect,
  onCustomUpload,
}: ThemeSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('nature');
  const [selectedTheme, setSelectedTheme] = useState<Theme | undefined>(currentTheme);

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    onThemeSelect(theme);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onCustomUpload) {
      onCustomUpload(file);
      onClose();
    }
  };

  const filteredThemes = themes.filter(theme => theme.category === selectedCategory);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute inset-0 bg-white overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">
                  Choose Theme
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Select a beautiful background for the memorial
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
              <div className="flex gap-2 px-6 py-4 overflow-x-auto scrollbar-hide">
                {themeCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      if (navigator.vibrate) navigator.vibrate(5);
                    }}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all
                      ${selectedCategory === category.id
                        ? 'bg-primary text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <span className="text-lg">{category.icon}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Custom Upload Card */}
                <label className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">
                      Upload Custom
                    </span>
                  </div>
                </label>

                {/* Theme Cards */}
                {filteredThemes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme)}
                    className="relative aspect-video rounded-xl overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Theme Preview */}
                    {theme.preview ? (
                      <Image
                        src={theme.preview}
                        alt={theme.name}
                        fill
                        className="object-cover"
                      />
                    ) : theme.gradient ? (
                      <div
                        className="absolute inset-0"
                        style={{ background: theme.gradient }}
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: theme.color }}
                      />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Theme Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-sm font-medium truncate">
                        {theme.name}
                      </p>
                    </div>

                    {/* Selected Indicator */}
                    {selectedTheme?.id === theme.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}

                    {/* Border on selected */}
                    {selectedTheme?.id === theme.id && (
                      <div className="absolute inset-0 border-4 border-primary rounded-xl pointer-events-none" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 bg-white">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-lg"
                >
                  Apply Theme
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
