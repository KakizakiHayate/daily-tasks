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
            const data = await getTasks();
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const addTask = async (taskData) => {
        try {
            setError(null);
            const newTask = await createTask(taskData);
            setTasks(prev => [...prev, newTask]);
            return newTask;
        } catch (err) {
            setError(err.message);
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