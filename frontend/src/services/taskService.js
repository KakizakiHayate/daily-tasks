import axios from './axios';

export const getTasks = async () => {
    try {
        const response = await axios.get('/tasks');
        return response.data;
    } catch (error) {
        console.error('Get tasks error:', error);
        throw new Error(error.response?.data?.message || 'タスクの取得に失敗しました');
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await axios.post('/tasks', taskData);
        if (!response.data) {
            throw new Error('サーバーからの応答が不正です');
        }
        return response.data;
    } catch (error) {
        console.error('Create task error:', error);
        if (error.response?.status === 419) {
            throw error; // CSRFエラーは上位で処理
        }
        throw new Error(error.response?.data?.message || 'タスクの作成に失敗しました');
    }
};

export const updateTask = async (taskId, taskData) => {
    try {
        const response = await axios.put(`/tasks/${taskId}`, taskData);
        return response.data;
    } catch (error) {
        console.error('Update task error:', error);
        throw new Error(error.response?.data?.message || 'タスクの更新に失敗しました');
    }
};

export const deleteTask = async (taskId) => {
    try {
        await axios.delete(`/tasks/${taskId}`);
    } catch (error) {
        console.error('Delete task error:', error);
        throw new Error(error.response?.data?.message || 'タスクの削除に失敗しました');
    }
};

export const getTask = async (taskId) => {
    try {
        const response = await axios.get(`/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error('Get task error:', error);
        throw new Error(error.response?.data?.message || 'タスクの取得に失敗しました');
    }
}; 