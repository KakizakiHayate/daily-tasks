import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

export function TaskEditor({ task, onSave, onCancel }) {
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedTask);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 shadow-sm border-2 border-indigo-200">
      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Task title"
            autoFocus
          />
        </div>
        
        <div>
          <select
            value={editedTask.priority}
            onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md flex items-center space-x-1"
          >
            <X size={16} />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center space-x-1"
          >
            <Check size={16} />
            <span>Save</span>
          </button>
        </div>
      </div>
    </form>
  );
}