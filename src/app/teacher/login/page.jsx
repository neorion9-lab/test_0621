'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Button } from '@/components/ui/Button';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseAuth() {
  if (!firebaseConfig.apiKey) return null;
  try {
    const existingApps = getApps();
    let app;
    if (existingApps.length > 0 && existingApps[0].options?.apiKey) {
      app = getApp();
    } else {
      // 빈 껍데기 앱이 있으면 무시하고 새로 시도
      app = existingApps.length === 0 ? initializeApp(firebaseConfig) : initializeApp(firebaseConfig, 'auth-app-' + Date.now());
    }
    return getAuth(app);
  } catch (e) {
    console.error('Firebase auth init error:', e);
    return null;
  }
}

export default function TeacherLogin() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    const authInstance = getFirebaseAuth();

    if (!authInstance) {
      setError('Firebase 환경변수가 설정되지 않았습니다. Vercel 환경변수를 확인해주세요.');
      setLoading(false);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(authInstance, provider);
      router.push('/teacher/dashboard');
    } catch (err) {
      console.error('로그인 에러:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('로그인 창이 닫혔습니다. 다시 시도해주세요.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('이 도메인은 Firebase에서 허용되지 않습니다. Firebase 콘솔 > Authentication > Authorized domains에 도메인을 추가해주세요.');
      } else {
        setError(`오류가 발생했습니다: ${err.message}`);
      }
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass text-center" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '700' }}>선생님 로그인 👩‍🏫</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>가정통신문을 관리하려면<br/>구글 계정으로 로그인해주세요.</p>
        
        {error && (
          <p style={{ color: 'var(--danger)', marginBottom: '1.5rem', fontSize: '0.9rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', wordBreak: 'break-word', textAlign: 'left' }}>
            {error}
          </p>
        )}

        <Button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          size="lg"
        >
          {loading ? (
            '로그인 중...'
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              구글로 계속하기
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
