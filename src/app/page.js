import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass text-center" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', maxWidth: '500px', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '700' }}>스마트 가정통신문</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>종이 없는 빠르고 간편한 디지털 회신서</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/parent/login" style={{ width: '100%' }}>
            <Button style={{ width: '100%' }} size="lg">👨‍👩‍👧‍👦 학부모로 시작하기</Button>
          </Link>
          <Link href="/teacher/dashboard" style={{ width: '100%' }}>
            <Button variant="secondary" style={{ width: '100%' }} size="lg">👩‍🏫 교사로 로그인하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
