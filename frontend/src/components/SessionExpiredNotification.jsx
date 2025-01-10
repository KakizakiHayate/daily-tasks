import React from 'react';

export function SessionExpiredNotification() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-100 p-4 text-center">
      <p className="text-yellow-800">
        セッションが期限切れになりました。ページを更新しています...
      </p>
    </div>
  );
} 