import React, { createContext, useContext, useState, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    const fetchTasks = useCallback(async () => {
        if (!isAuthenticated) return;
        
        try {
            setLoading(true);
            setError(null);
            const response = await getTasks();
            console.log('response:', response);
            if (response && Array.isArray(response)) {
                setTasks(response);
            } else {
                console.error('Invalid response format:', response);
                setError('データの取得に失敗しました');
            }
        } catch (err) {
            console.error('Fetch tasks error:', err);
            setError(err.message || 'タスクの取得中にエラーが発生しました');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const addTask = async (taskData) => {
        try {
            setError(null);
            const response = await createTask(taskData);
            if (response && response.id) {
                setTasks(prev => [...prev, response]);
                return response;
            } else {
                throw new Error('タスクの作成に失敗しました');
            }
        } catch (err) {
            console.error('Add task error:', err);
            if (err.response?.status === 419) {
                // CSRF/セッションエラーの場合は、ページをリロード
                window.location.reload();
                return;
            }
            setError(err.message || 'タスクの作成中にエラーが発生しました');
            throw err;
        }
    };

    const editTask = async (taskId, taskData) => {
        try {
            setError(null);
            const updatedTask = await updateTask(taskId, taskData);
            setTasks(prev => prev.map(task => 
                task.id === taskId ? updatedTask : task
            ));
            return updatedTask;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const removeTask = async (taskId) => {
        try {
            setError(null);
            await deleteTask(taskId);
            setTasks(prev => prev.filter(task => task.id !== taskId));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const toggleTaskCompletion = async (taskId, isCompleted) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        try {
            const updatedTask = await editTask(taskId, {
                ...task,
                is_completed: isCompleted,
                completed_at: isCompleted ? new Date().toISOString() : null
            });

            // タスクが完了状態になった場合のみ、task_logsにデータを保存
            // バックエンドのTaskControllerで処理されるので、ここでは特別な処理は不要
            return updatedTask;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return (
        <TaskContext.Provider value={{
            tasks,
            loading,
            error,
            fetchTasks,
            addTask,
            editTask,
            removeTask,
            toggleTaskCompletion
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
}; 