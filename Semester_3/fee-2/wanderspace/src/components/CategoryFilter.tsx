/**
 * CategoryFilter Component
 * ------------------------------------------------------------
 * Filter pill bar allowing users to filter listings by category.
 */

import React from 'react';
import { Sparkles, Palmtree, Trees, Castle, Sun, Building, Compass } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES = [
  { id: 'All', label: 'All Stays', icon: Compass },
  { id: 'Trending', label: 'Trending', icon: Sparkles },
  { id: 'Beachfront', label: 'Beachfront', icon: Palmtree },
  { id: 'Cabins', label: 'Cabins', icon: Trees },
  { id: 'Mansions', label: 'Mansions', icon: Castle },
  { id: 'Countryside', label: 'Countryside', icon: Sun },
  { id: 'Lofts', label: 'Urban Lofts', icon: Building },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="category-bar">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`category-pill ${isActive ? 'active' : ''}`}
          >
            <Icon size={16} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
