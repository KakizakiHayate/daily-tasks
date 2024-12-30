import React from 'react';
import { Trophy, Award, Star } from 'lucide-react';

export function AchievementCard({ achievement }) {
  const icons = {
    streak: Trophy,
    completion: Award,
    milestone: Star,
  };

  const Icon = icons[achievement.type];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">{achievement.title}</h3>
          <p className="text-sm text-gray-500">
            {new Date(achievement.date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
} 