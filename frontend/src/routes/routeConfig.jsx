import { Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { Dashboard } from '../pages/Dashboard';
import { RequireAuth } from '../components/RequireAuth';
import { TaskEditor } from '../components/TaskEditor';
import { TaskView } from '../components/TaskView';
import { AchievementCard } from '../components/AchievementCard';

export const routes = [
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    )
  },
  {
    path: '/tasks/:taskId/edit',
    element: (
      <RequireAuth>
        <TaskEditor />
      </RequireAuth>
    )
  },
  {
    path: '/tasks/:taskId',
    element: (
      <RequireAuth>
        <TaskView />
      </RequireAuth>
    )
  },
  {
    path: '/achievements',
    element: (
      <RequireAuth>
        <AchievementCard />
      </RequireAuth>
    )
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />
  }
]; 