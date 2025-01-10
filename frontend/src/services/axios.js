import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8001/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// CSRFトークンを取得する関数
const refreshCsrfToken = async () => {
    try {
        await axios.get('http://localhost:8001/sanctum/csrf-cookie', {
            withCredentials: true
        });
    } catch (error) {
        console.error('CSRFトークンの更新に失敗しました:', error);
        // エラーが発生した場合は、ページをリロード
        window.location.reload();
    }
};

// レスポンスインターセプターを追加
instance.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 419) {
            // セッション期限切れイベントを発火
            window.dispatchEvent(new Event('session-expired'));
            
            console.log('セッションが期限切れになりました。ページを更新します...');
            // CSRFトークンを更新
            await refreshCsrfToken();
            
            // 少し待ってからページをリロード（通知を表示する時間を確保）
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
            return;
        }
        return Promise.reject(error);
    }
);

export default instance; 