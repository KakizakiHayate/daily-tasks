import React, { useState } from 'react';
import { Pencil, Trash2, ArrowRight, Check, X } from 'lucide-react';
import { TaskEditor } from './TaskEditor';
import { TaskView } from './TaskView';

export function TaskCard({ task, onComplete, onDelete, onPostpone, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (updatedTask) => {
    onUpdate(updatedTask);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TaskEditor
        task={task}
        onSave={handleEdit}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <TaskView
      task={task}
      onComplete={onComplete}
      onDelete={onDelete}
      onPostpone={onPostpone}
      onEdit={() => setIsEditing(true)}
    />
  );
}