import { CheckCircle, Trash2, Clock, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlyAwayCard } from './FlyAwayCard';
import { WindTrail } from './WindTrail';
import { SparkleEffect } from './SparkleEffect';
import { useTaskAnimation } from '../hooks/useTaskAnimation';

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

const priorityLabels = {
  high: '高',
  medium: '中',
  low: '低',
};

export function TaskCard({ task, onComplete, onDelete, onPostpone, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
  });
  const { isAnimating, startFlyAnimation } = useTaskAnimation();

  const handleComplete = async () => {
    if (task.is_completed || isAnimating) {
      return;
    }
    
    if (window.confirm('このタスクを完了としてマークしますか？\n※この操作は取り消せません。')) {
      await startFlyAnimation();
      onComplete(task.id);
    }
  };

  const handleDelete = () => {
    if (task.is_completed) {
      alert('完了済みのタスクは削除できません。');
      return;
    }

    if (window.confirm('このタスクを削除してもよろしいですか？')) {
      onDelete(task.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    onEdit(task.id, { ...editData, due_date: formattedDate });
    setIsEditing(false);
  };

  if (isAnimating) {
    return (
      <FlyAwayCard task={task}>
        <WindTrail />
      </FlyAwayCard>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">タイトル</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">説明</label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows="2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">優先度</label>
            <select
              value={editData.priority}
              onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-lg shadow p-4 ${task.is_completed ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleComplete}
            className={`mt-1 rounded-full p-1 transition-colors ${
              task.is_completed
                ? 'text-green-500 hover:text-green-600'
                : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            <CheckCircle size={20} />
          </motion.button>
          <div>
            <motion.h3
              layout
              className={`text-lg font-medium ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
            >
              {task.title}
            </motion.h3>
            {task.description && (
              <motion.p
                layout
                className="mt-1 text-sm text-gray-600"
              >
                {task.description}
              </motion.p>
            )}
            <motion.div layout className="mt-2 flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                優先度: {priorityLabels[task.priority]}
              </span>
              {task.due_date && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  期限: {format(new Date(task.due_date), 'yyyy/MM/dd', { locale: ja })}
                </span>
              )}
              {task.created_at && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  作成: {format(new Date(task.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                </span>
              )}
            </motion.div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className={`text-gray-400 hover:text-indigo-500 transition-colors ${
              task.is_completed ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={task.is_completed}
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => onPostpone(task.id)}
            className={`text-gray-400 hover:text-gray-500 transition-colors ${
              task.is_completed ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={task.is_completed}
          >
            <Clock size={20} />
          </button>
          <button
            onClick={handleDelete}
            className={`text-gray-400 hover:text-red-500 transition-colors ${
              task.is_completed ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      {task.is_completed && <SparkleEffect />}
    </motion.div>
  );
}