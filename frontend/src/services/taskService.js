import axios from './axios';

export const getTasks = async () => {
    const response = await axios.get('/tasks');
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await axios.post('/tasks', taskData);
    return response.data;
};

export const updateTask = async (taskId, taskData) => {
    const response = await axios.put(`/tasks/${taskId}`, taskData);
    return response.data;
};

export const deleteTask = async (taskId) => {
    await axios.delete(`/tasks/${taskId}`);
};

export const getTask = async (taskId) => {
    const response = await axios.get(`/tasks/${taskId}`);
    return response.data;
}; 