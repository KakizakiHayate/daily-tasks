import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Layout, Award, LogOut, UserX, Menu, X } from 'lucide-react';
import { TaskCard } from '../components/TaskCard';
import { ProgressCircle } from '../components/ProgressCircle';
import { AchievementCard } from '../components/AchievementCard';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import authService from '../services/authService';

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { tasks, loading, error, fetchTasks, addTask, editTask, removeTask, toggleTaskCompletion } = useTask();
  const [achievements] = useState([
    {
      id: '1',
      title: '3日連続達成！',
      date: new Date(),
      type: 'streak',
    },
    {
      id: '2',
      title: '10個のタスクを完了',
      date: new Date(),
      type: 'milestone',
    },
  ]);

  const [activeTab, setActiveTab] = useState('tasks');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 日付が今日かどうかをチェック
  const isToday = (dateString) => {
    if (!dateString) return false;
    
    const today = new Date();
    const jstOffset = 9 * 60; // JSTは+9:00
    const targetDate = new Date(dateString);
    
    // 日本時間での日付を取得
    const todayJST = new Date(today.getTime() + (jstOffset * 60 * 1000));
    const targetDateJST = new Date(targetDate.getTime() + (jstOffset * 60 * 1000));
    
    return todayJST.toISOString().split('T')[0] === targetDateJST.toISOString().split('T')[0];
  };

  // 今日のタスクのみをフィルタリング
  const todaysTasks = tasks.filter(task => isToday(task.due_date));

  // 優先度の高いタスクのみをフィルタリング
  const highPriorityTasks = todaysTasks.filter(task => {
    console.log(`タスクID: ${task.id}, Priority: ${task.priority}, Is Completed: ${task.is_completed}`);
    return task.priority === 'high';
  });
  
  console.log('全タスク:', tasks);
  console.log('今日のタスク:', todaysTasks);
  console.log('優先度の高いタスク:', highPriorityTasks);
  console.log('完了済みの優先度の高いタスク:', highPriorityTasks.filter(task => task.is_completed));

  const completionRate = highPriorityTasks.length > 0
  ? (highPriorityTasks.filter(task => {
      console.log('task.is_completed:', task.is_completed);
      console.log('task:', task);
      return task.is_completed;
    }).length / highPriorityTasks.length) * 100
  : 0;

  const handleComplete = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task) {
        // 完了状態のみを更新
        await editTask(id, {
          title: task.title,
          description: task.description,
          priority: task.priority,
          due_date: task.due_date,  // 既存の期限日をそのまま使用
          is_completed: true
        });
        const message = `タスク「${task.title}」を完了しました！`;
        alert(message);
      }
    } catch (error) {
      console.error('タスク状態変更エラー:', error);
      alert('タスクの状態変更中にエラーが発生しました。');
    }
  };

  const handleDelete = async (id) => {
    await removeTask(id);
  };

  const handlePostpone = (id) => {
    console.log('タスクを延期:', id);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    // ドラッグ&ドロップの順序変更は保存しない
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    const today = new Date();
    // UTCで日付を生成し、それをYYYY-MM-DD形式に変換
    const formattedDate = today.toISOString().split('T')[0];

    const newTask = {
      title: newTaskTitle,
      description: '',
      priority: 'medium',
      due_date: formattedDate,
    };

    await addTask(newTask);
    setNewTaskTitle('');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) {
      try {
        await authService.deleteAccount();
        logout();
        navigate('/login');
      } catch (error) {
        console.error('アカウント削除エラー:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ 
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23000000" fill-opacity="0.03" fill-rule="evenodd"/%3E%3C/svg%3E")',
    }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Today's Wrap-Up</h1>
            
            {/* デスクトップナビゲーション */}
            <div className="hidden md:flex space-x-4">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'tasks'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Layout size={20} />
                <span>タスク</span>
              </button>
              
              {/* 以下は将来的に実装予定 */}
              {/* <button
                onClick={() => setActiveTab('achievements')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'achievements'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Award size={20} />
                <span>実績</span>
              </button> */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-red-100 hover:text-red-700"
              >
                <LogOut size={20} />
                <span>ログアウト</span>
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-red-100 hover:text-red-700"
              >
                <UserX size={20} />
                <span>アカウント削除</span>
              </button>
            </div>

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* モバイルナビゲーションメニュー */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 -mx-6 px-6 py-4 space-y-4">
              <button
                onClick={() => {
                  setActiveTab('tasks');
                  setIsMenuOpen(false);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors w-full ${
                  activeTab === 'tasks'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Layout size={20} />
                <span>タスク</span>
              </button>
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-red-100 hover:text-red-700 w-full"
              >
                <LogOut size={20} />
                <span>ログアウト</span>
              </button>
              <button
                onClick={() => {
                  handleDeleteAccount();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-red-100 hover:text-red-700 w-full"
              >
                <UserX size={20} />
                <span>アカウント削除</span>
              </button>
            </div>
          )}

          {activeTab === 'tasks' && (
            <>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">今日の進捗</h2>
                  <div className="flex flex-col items-center">
                    <ProgressCircle percentage={completionRate} />
                    <p className="mt-4 text-sm text-gray-600">
                      {completionRate === 100
                        ? "素晴らしい！全てのタスクを完了しました！"
                        : `今日のタスクの${Math.round(completionRate)}%が完了しました！`}
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">クイック追加</h2>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="新しいタスクを入力..."
                        className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <button
                        onClick={handleAddTask}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PlusCircle size={20} className="mr-2" />
                        追加
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {todaysTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={{
                                  ...task,
                                  completed: task.is_completed,
                                }}
                                onComplete={handleComplete}
                                onDelete={handleDelete}
                                onPostpone={handlePostpone}
                                onEdit={editTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          )}

          {activeTab === 'achievements' && (
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 