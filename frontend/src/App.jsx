import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { useState, useEffect } from 'react';
import { SessionExpiredNotification } from './components/SessionExpiredNotification';

function App() {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    // グローバルイベントリスナーを設定
    const handleSessionExpired = () => {
      setIsSessionExpired(true);
      // 3秒後に通知を非表示にする
      setTimeout(() => {
        setIsSessionExpired(false);
      }, 3000);
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          {isSessionExpired && <SessionExpiredNotification />}
          <AppRoutes />
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
