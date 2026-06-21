'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ParentLogin() {
  const router = useRouter();
  const [classCode, setClassCode] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!classCode) return alert('학급 코드를 입력해주세요.');
    localStorage.setItem('classCode', classCode);
    // 임시로 1번 폼으로 이동시킴 (실제로는 코드를 통해 폼 리스트를 불러오거나 바로 리다이렉트)
    router.push('/parent/form/1'); 
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <div className="glass text-center" style={{ padding: '3rem 2rem', borderRadius: 'var(--radius-lg)' }}>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: '700' }}>학부모 간편 접속</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>선생님이 안내해주신 학급 코드를 입력하세요.</p>
        
        <form onSubmit={handleLogin}>
          <Input 
            placeholder="예: 3학년 2반 -> 302" 
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.1rem' }}
          />
          <Button type="submit" style={{ width: '100%', marginTop: '1rem' }} size="lg">접속하기</Button>
        </form>
      </div>
    </div>
  );
}
